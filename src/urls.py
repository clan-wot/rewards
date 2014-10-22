from django.conf.urls.defaults import *
import views, order

urlpatterns = patterns('',
  url(r'^$', views.mainpage, name='mainpage'),
  url(r'^clan$', views.clan_leave, name='clan_leave'),
  url(r'^clan/(?P<clanid>.*)$', views.clan, name='clan'),
  url(r'^order$', order.view, name='order'),
)
