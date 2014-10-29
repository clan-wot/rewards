import logging, json

from django.http import HttpResponseRedirect, Http404, HttpResponse
from django.shortcuts import redirect, render_to_response
from django.template import RequestContext, TemplateDoesNotExist, Context as StdContext
from django.core.urlresolvers import reverse
from django.conf import settings
from django.core.servers.basehttp import FileWrapper

from google.appengine.ext import db, blobstore

import django_tables2 as tables
import data, papi, settings

# key: wotid
class Account(db.Model):
    nick = db.StringProperty(default='')
    forum_id = db.StringProperty(default='')
    clan_id = db.StringProperty(default='')
    rank = db.IntegerProperty(default=0)
    rewards = db.TextProperty(default='')

def mainpage(request):
    return render_to_response('main.html', {'clans': data.clans, })

def db_export(request):
    dat = [(acc.key().name(), acc.nick, acc.forum_id, acc.clan_id, acc.rank, acc.rewards) for acc in db.GqlQuery("SELECT * FROM Account")]
    return HttpResponse(json.dumps(dat, indent=2), content_type="application/json")

def data_import(dat):
    #logging.info(json.dumps(dat, indent=2))
    acc_list = db.get([db.Key.from_path('Account', x[0]) for x in dat])

    i = 0
    import_list = []
    while i < len(acc_list):
        acc = acc_list[i]
        if acc is None:
            (key, nick, forum_id, clan_id, rank, rewards) = dat[i]
            acc = Account(key_name=key)
            acc.nick = nick
            acc.forum_id = forum_id
            acc.clan_id = clan_id #''
            acc.rank = rank
            acc.rewards = rewards
            import_list.append(acc)
        i += 1

    if import_list:
        db.put(import_list)
    logging.warning("imported: %d" % len(import_list))

def db_import(request):
    return render_to_response('import.html', RequestContext(request, {'upload_url': blobstore.create_upload_url('/edit/import/')}))

class Table(tables.Table):
    def __init__(self, *args, **kwargs):

        django_request = kwargs.get('request', None)
        if 'request' in kwargs:
            del kwargs['request']

        rows_per_page = kwargs.get('rows_per_page', 100)
        if 'rows_per_page' in kwargs:
            del kwargs['rows_per_page']

        super(Table, self).__init__(*args, **kwargs)
        attrs = self.attrs
        attrs["class"] = "table table-hover paleblue"
        self.attrs = attrs
        self.default = ""
        if django_request:
            tables.RequestConfig(django_request, paginate={"per_page": rows_per_page}).configure(self)

templ_nick = "{% if record.2 %}<a target='_blank' id='link_{{record.2}}' href='" + data.forum + "/{{record.2}}'>{{value}}</a>{% else %}{{value}}{% endif %}"

def table_view(request, dat):
    columns = {}
    columns['nick'] = tables.TemplateColumn(templ_nick, accessor="1", verbose_name="Member", order_by="1.upper")
    columns['rank'] = tables.Column(accessor="6", verbose_name="Rank", order_by="4")
    columns['rewards'] = tables.Column(accessor="5", verbose_name="Rewards")
    return type('TableView', (Table,), columns)(dat, request=request)

def table_edit(request, dat):

    templ_forum = """
<input type="text" name="forum_{{record.0}}" size="6" value="{{value}}" />
"""

    templ_rank = """
<select name="rank_{{record.0}}" {% if record.2 %}id="rank_{{record.2}}"{% endif %}>
{% for key, val in forum_ranks.items %}
<option value="{{key}}"{% if key == value %} selected="selected"{% endif %}>{{val.0}}</option>
{% endfor %}
{{value}}
</select>
"""

    columns = {}
    columns['nick'] = tables.TemplateColumn(templ_nick, accessor="1", verbose_name="Member", order_by="1.upper")
    columns['forum'] = tables.TemplateColumn(templ_forum, accessor="2", verbose_name="Forum")
    columns['rank'] = tables.TemplateColumn(templ_rank, accessor="4", verbose_name="Rank")
    columns['rewards'] = tables.Column(accessor="5", verbose_name="Rewards")
    return type('TableEdit', (Table,), columns)(dat, request=request)

def view_ro(request, clanid, clantag):
    dat = [(acc.key().name(), acc.nick, acc.forum_id, acc.clan_id, acc.rank, acc.rewards, data.ranks[acc.rank][0]) for acc in db.GqlQuery("SELECT * FROM Account WHERE clan_id='%s'" % clanid)]
    return render_to_response('view.html', RequestContext(request, {'clanid': clanid, 'table': table_view(request, dat), 'clantag': clantag}))

def clan_leave(request):
    return view_ro(request, '', '')

def clan(request, clanid):
    if clanid not in data.clans:
        raise(Http404)
    return view_ro(request, clanid, data.clans[clanid][0])

def edit(request, clanid):
    if clanid not in data.clans:
        raise(Http404)

    if request.method == 'POST':
        if "update" in request.POST:
            update_clan(clanid)
            return redirect("%s?sort=nick" % reverse('clan', None, [], {'clanid': clanid,}))
        if "save" in request.POST:
            db_data = {itm.key().name(): itm for itm in db.GqlQuery("SELECT * FROM Account WHERE clan_id='%s'" % clanid)}
            save_list = []
            for key, item in request.POST.items():

                if key.startswith('forum_'):
                    acc_id = key.split('_')[1]
                    acc = db_data[acc_id]
                    if acc.forum_id != item.strip():
                        acc.forum_id = item.strip()
                        if acc not in save_list:
                            save_list.append(acc)

                if key.startswith('rank_'):
                    acc_id = key.split('_')[1]
                    acc = db_data[acc_id]
                    if acc.rank != int(item):
                        acc.rank = int(item)
                        if acc not in save_list:
                            save_list.append(acc)

            db.put(save_list)
            logging.info("save %d" % len(save_list))
            return redirect("%s?sort=nick" % reverse('clan', None, [], {'clanid': clanid,}))

    dat = [(acc.key().name(), acc.nick, acc.forum_id, acc.clan_id, acc.rank, acc.rewards, data.ranks[acc.rank][0]) for acc in db.GqlQuery("SELECT * FROM Account WHERE clan_id='%s'" % clanid)]
    return render_to_response('edit.html', RequestContext(request, {'forum_ranks': data.ranks, 'table': table_edit(request, dat), 'clanid': clanid, 'clantag': data.clans[clanid][0]}))

def update_clan(clanid):
    dat = papi.Session(papi.Server.RU, settings.papy_key).fetch('wot/clan/info', 'fields=members.account_name&clan_id=%s' % clanid)
    dat_new = {key: value['account_name'] for (key, value) in dat[clanid]['members'].items()}
    #logging.warning("dat_new: %s" % repr(dat_new))

    q = db.GqlQuery("SELECT * FROM Account WHERE clan_id='%s'" % clanid)
    dat_old = {itm.key().name(): [itm.nick, itm.forum_id, itm.rank, itm.rewards] for itm in q}
    #logging.warning("dat_old: %s" % repr(dat_old))

    set_new = set(dat_new.keys())
    set_old = set(dat_old.keys())
    user_new = set_new - set_old
    user_leave = set_old - set_new
    user_regular = set_new.intersection(set_old)

    #logging.warning("user_new: %s" % repr(user_new))
    #logging.warning("user_leave: %s" % repr(user_leave))
    #logging.warning("user_regular: %s" % repr(user_regular))

    if user_new:
        key_list = list(user_new)
        save_list = db.get([db.Key.from_path('Account', key) for key in key_list])
        i = 0
        created = 0
        while i < len(save_list):
            acc = save_list[i]
            if acc is None:
                created += 1
                acc = Account(key_name=key_list[i])

            acc.clan_id = clanid
            acc.nick = dat_new[key_list[i]]
            save_list[i] = acc
            i += 1

        db.put(save_list)
        logging.warning("new created: %d" % created)
        logging.warning("new exist: %d" % (len(save_list) - created))

    if user_leave:
        save_list = db.get([db.Key.from_path('Account', key) for key in user_leave])
        for acc in save_list:
            acc.clan_id = ''
        db.put(save_list)
        logging.warning("leave: %d" % len(save_list))

    if user_regular:
        # check for nick changes
        save_list = []
        for key in user_regular:
            if dat_new[key] != dat_old[key][0]:
                save_list.append(db.Key.from_path('Account', key))
        if save_list:
            save_list = db.get(save_list)
            for acc in save_list:
                acc.nick = dat_new[acc.key().name()]
            db.put(save_list)
        logging.warning("nick: %d" % len(save_list))
