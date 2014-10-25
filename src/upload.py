import logging, datetime

from google.appengine.ext import webapp, db, blobstore
from google.appengine.ext.webapp import blobstore_handlers
from google.appengine.api import taskqueue, users

class UploadHandler(blobstore_handlers.BlobstoreUploadHandler):

  def toError(self, msg, page='upload'):
    logging.warning(msg)
    if self.replay is not None:
      self.replay.delete()
    self.redirect('/error/%s' % page)

  def post(self):
    tzone.Context().process_request(self.request)
    self.replay = None

    try:
      replays = self.get_uploads('replay')
      server = self.request.get("server")
      clanid = self.request.get("clanid")
      clantag = self.request.get("clantag")
      compilerid = self.request.get("compilerid")
  
      if len(replays) < 1:
        self.redirect('/clan/%s/%s/action/?actions-sort=-date&commanders-sort=-total' % (server, clanid))
        return
  
      self.replay = replays[0]

      try:
        rep = wot.replay.Data(blobstore.BlobReader(self.replay))
      except Exception, e:
        self.toError("Wrong [%s] replay %s: %s" % (clantag, self.replay.filename, e))
        return

      clankey = "%s_%s" % (server, clanid)
      cl = wot.models.Clan.get_by_key_name(clankey)
      if cl is None:
        self.toError("Wrong clan ID for replay upload: %s [%s]" % (clankey, clantag))
        return

      if users.get_current_user() and users.is_current_user_admin():
        compiler = None
        compiler_id = ''
      else:
        compiler = wot.models.Account.get_by_key_name("%s_%s" % (server, compilerid))
        if compiler is None:
          self.toError("Wrong compiler account ID: %s_%s [%s]" % (server, compilerid, clantag))
          return
        compiler_id = str(compiler.wotid)

      logging.info("### rep.battleType: %s" % rep.battleType)
  
      typ = get_battle_type(rep)
      battles = 0
      victories = 0
      if typ != wot.ACTION.TRAINING:
        battles = 1
        victories = 1 if rep.isClanWinner(clantag) else 0

      lst = dict([(y.wotid, y) for y in [wot.models.Account.all().filter('server =', server).filter('name =', x).get() for x in rep.clanMembers(clantag)] if y is not None])
      if not lst:
        self.toError("No clan members [%s] in replay: %s" % (clantag, self.replay.filename), page='upload_nomembers')
        return

      if compiler_id in lst:
        commander = compiler
      elif str(rep.player_id) in lst:
        commander = lst[str(rep.player_id)]
      else:
        commander = lst[lst.keys()[0]]

      dt = tzone.from_ltime(rep.date)

      evnt = wot.models.ClanEvent(parent=cl)
      evnt.dateStart = dt
      evnt.name = ''
      evnt.compiler = compiler
      evnt.typ = typ
      evnt.battles = battles
      evnt.victories = victories
      evnt.commander = commander
      evnt.draft = "#".join(["%s||" % key for key in lst])
      evnt.put()
  
      r = wot.models.Replays(parent=evnt)
      r.date_event = dt
      r.version = rep.version
      r.game_map = rep.gamemap
      r.battle_type = typ
      r.author = rep.player_name
      r.tank = rep.tank
      r.isVictory = (victories == 1)
      r.replay = self.replay.key()
      r.put()

      replay_view_file = "%s/%s/%s/%s" % (server, clanid, evnt.key().id(), r.key().id())
      replay_info.touch(replay_view_file)
      taskqueue.add(url='/update/replay-view/%s' % replay_view_file, target='backend')
  
      wot.clan.clear_actions_draft(clankey)
      self.redirect('/clan/%s/%s/action/%s?replays-sort=-date&members-sort=nick' % (server, clanid, evnt.key().id()))
      return

    except Exception, e:
      self.toError("upload Exception: %s" % e)

app = webapp.WSGIApplication([
  ('/edit/upload', UploadHandler)
  ], debug=True)
