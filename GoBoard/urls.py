from django.conf.urls import patterns, include, url
from django.contrib import admin

#Enable the admin interface.
admin.autodiscover()


urlpatterns = patterns('',
     # Home page:
     url(r'^$', 'GoBoard.views_to_abstract.main_page',),
     url(r'^home/?$', 'GoBoard.views_to_abstract.main_page',),

     url(r'^new_message/?$', 'GoBoard.views_to_abstract.new_message',),
     url(r'^get_messages/?$', 'GoBoard.views_to_abstract.send_messages',),

     url(r'^get_tags/?$', 'GoBoard.views.tags.get_tags',),

     #Views for transfering basic "#tags" back to the auto-update container.
     url(r'^get_recent_tags/?$', 
                  'GoBoard.views.tags.get_tags',{"query":"recent"}),
     url(r'^get_trending_tags/?$', 
                  'GoBoard.views.tags.get_tags',{"query":"trending"}),

     #Views for user authentication.
     url(r'^accounts/login/?$', 'GoBoard.views.authentication.login_view',),
     url(r'^accounts/logout/?$', 'GoBoard.views.authentication.logout_view',),

     #Views for user "support" (eg: new user, forgot password, etc.)
     url(r'^accounts/create/?$', 'GoBoard.views.user_creation.create_user',),

     #Views for user-specific settings/information.
     url(r'^settings/?$', 'GoBoard.views.user_settings.load_settings',),
     url(r'^update_settings/?$', 'GoBoard.views.user_settings.update_settings',),

     url(r'^userCount/?$', 'GoBoard.sessionCounter.sendActiveUserCount',),
     url(r'^admin/?', include(admin.site.urls)),
)

