from django.conf.urls import patterns, include, url
from django.contrib import admin

#Enable the admin interface.
admin.autodiscover()


urlpatterns = patterns('',
     # Home page:
     url(r'^$', 'GoBoard.views_to_abstract.load_chat',),
     url(r'^home/?$', 'GoBoard.views_to_abstract.load_chat',),
     url(r'^chat/?$', 'GoBoard.views_to_abstract.load_chat',),

     url(r'^new_message/?$', 'GoBoard.views_to_abstract.new_message',),
     url(r'^get_messages/?$', 'GoBoard.views_to_abstract.send_messages',),

     #View for getting tag information for autocomplete inputs.
     url(r'^get_tags/?$', 'GoBoard.views.tags.get_tags',),
     url(r'^get_usernames/?$', 'GoBoard.views.users.get_usernames',),

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
     url(r'^accounts/forgot/?$', 'GoBoard.views.forgot_password.forgot_password',),

     #Views for user-specific settings/information.
     url(r'^settings/?$', 'GoBoard.views.user_settings.load_settings',),
     url(r'^update_settings/?$', 'GoBoard.views.user_settings.update_settings',),

     #Views for user cards.
     url(r'^cards?/?$', 'GoBoard.views.cards.load_cards',),
     url(r'^deleteCard/?$', 'GoBoard.views.cards.delete_card',),
     url(r'^addCard/?$', 'GoBoard.views.cards.add_card',),
     url(r'^get_available_cards/?$', 'GoBoard.views.cards.get_available_cards',),

     #Views specific to cards.
     url(r'^get_SEPTA_times/?$', 'GoBoard.views.cards.get_SEPTA_times',),
     url(r'^get_clerk_articles/?$', 'GoBoard.views.cards.get_rss_articles',
                  {
                   "url":"http://haverfordclerk.com/rss/",
                   "maxArticles":3
                  }),
     url(r'^get_bico_articles/?$', 'GoBoard.views.cards.get_rss_articles',
                  {"url":"http://biconews.com/rss/",
                   "maxArticles":4,
                  }),

     url(r'^userCount/?$', 'GoBoard.sessionCounter.sendActiveUserCount',),
     url(r'^admin/?', include(admin.site.urls)),
)

