import logging

from django.http import HttpResponseRedirect, Http404, HttpResponse
from django.shortcuts import redirect, render_to_response
from django.template import RequestContext, TemplateDoesNotExist, Context as StdContext
from django.core.urlresolvers import reverse
from django import forms

import data

def mainpage(request):
  return render_to_response('main.html', {'clans': data.clans, })

def clan_leave(request):
  return HttpResponse('clan_leave')

def clan(request, clanid):
  return HttpResponse(clanid)

from google.appengine.ext import db

# key: wotid
class Account(db.Model):
  nick = db.StringProperty()
  forum_id = db.StringProperty()
  rank = db.IntegerProperty(default=0)
  rewards = db.TextProperty()

