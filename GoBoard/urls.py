from django.conf.urls import patterns, include, url
from django.contrib import admin

#Enable the admin interface.
admin.autodiscover()


urlpatterns = patterns('',
    # Examples:
     url(r'^$', 'GoBoard.views.main_page',),
     url(r'^home/?$', 'GoBoard.views.main_page',),

     url(r'^new_message/?$', 'GoBoard.views.new_message',),
     url(r'^get_messages/?$', 'GoBoard.views.send_messages',),

     url(r'^get_tags/?$', 'GoBoard.views.get_tags',),
     url(r'^get_recent_tags/?$', 'GoBoard.views.get_recent_tags',),

     url(r'^userCount/?$', 'GoBoard.sessionCounter.sendActiveUserCount',),
     url(r'^admin/?', include(admin.site.urls)),
)

