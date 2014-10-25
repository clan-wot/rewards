from django.conf.urls.defaults import *
import views, order

urlpatterns = patterns('',
  url(r'^$', views.mainpage, name='mainpage'),
  url(r'^clan$', views.clan_leave, name='clan_leave'),
  url(r'^clan/(?P<clanid>.*)$', views.clan, name='clan'),
  url(r'^edit/import$', views.db_import, name='db_import'),
  url(r'^edit/export$', views.db_export, name='db_export'),
  url(r'^edit/(?P<clanid>.*)$', views.edit, name='edit'),
  url(r'^order$', order.view, name='order'),
)
