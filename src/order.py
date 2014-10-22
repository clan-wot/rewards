import logging

from django.http import HttpResponseRedirect, Http404, HttpResponse
from django.shortcuts import redirect, render_to_response
from django.template import RequestContext, TemplateDoesNotExist, Context as StdContext
from django.core.urlresolvers import reverse
from django import forms

class Order(forms.Form):
  source = forms.CharField(widget=forms.Textarea)

def view(request):
  data = []
  if request.method == 'POST':
    form = Order(request.POST)
    if form.is_valid():
      data = trans(form.cleaned_data['source'])
      #logging.info("send data: %s" % repr(data))
  else:
    form = Order()

  return render_to_response('order.html', {'form': form, 'data': data, }, context_instance=RequestContext(request))

def trans(txt):
  people = {}
  for line in txt.splitlines():
    try:
      prize, data = line.split(':')
      for acc in data.split(','):
        acc = acc.strip()
        if acc in people:
          people[acc].append(prize)
        else:
          people[acc] = [prize]

    except:
      pass

  dat = [[x] + people[x] for x in people]
  dat.sort(key=lambda x: x[0].lower())
  return dat
