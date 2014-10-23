import logging

from django.http import HttpResponseRedirect, Http404, HttpResponse
from django.shortcuts import redirect, render_to_response
from django.template import RequestContext, TemplateDoesNotExist, Context as StdContext
from django.core.urlresolvers import reverse
from django import forms

import data
# https://ru.wargaming.net/developers/api_explorer/wot/clan/info/?application_id=demo&fields=members.account_id,members.account_name&clan_id=43856&http_method=GET&run=1

def mainpage(request):
    return render_to_response('main.html', {'clans': data.clans, })

def clan_leave(request):
    return render_to_response('view.html', {})

def clan(request, clanid):
    if clanid not in data.clans:
        raise(Http404)

    return render_to_response('view.html', {'clanid': clanid, 'clantag': data.clans[clanid][0]})

def edit(request, clanid):
  return HttpResponse("edit '%s'" % clanid)

from google.appengine.ext import db

# key: wotid
class Account(db.Model):
    nick = db.StringProperty()
    forum_id = db.StringProperty()
    rank = db.IntegerProperty(default=0)
    rewards = db.TextProperty()

