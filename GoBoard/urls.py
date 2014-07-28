from django.conf.urls import patterns, include, url
from django.contrib import admin

#Enable the admin interface.
admin.autodiscover()


urlpatterns = patterns('',
     # Home Page:
     url(r'^$', 'GoBoard.views.cards.load_cards', name="home"),
     url(r'^home/?$', 'GoBoard.views.cards.load_cards', name="home"),

     # Chat Page:
     url(r'^chat/?$', 'GoBoard.views_to_abstract.load_chat', name="chat"),

     url(r'^new_message/?$', 'GoBoard.views_to_abstract.new_message',),
     url(r'^get_messages/?$', 'GoBoard.views_to_abstract.send_messages',),
     url(r'^messages?/delete/?$', 'GoBoard.views.messages.delete',),

     #View for getting tag information for autocomplete inputs.
     url(r'^get_tags/?$', 'GoBoard.views.tags.get_tags',),
     url(r'^tags/follow/$', 'GoBoard.views.tags.get_followed_tags',),
     url(r'^tags/follow/new/$', 'GoBoard.views.tags.follow_new',),
     url(r'^tags/follow/delete/$', 'GoBoard.views.tags.follow_delete',),
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

     #Views for events.
     url(r'^events/manage/?$', 'GoBoard.views.events.manager',),
     url(r'^events/form/(?P<did>[0-9]*)/?$', 'GoBoard.views.events.form',),
     url(r'^events/delete/(?P<did>[0-9]+)/?$', 'GoBoard.views.events.delete',),
     url(r'^events/submit/$', 'GoBoard.views.events.submit', name="submitEvent"),
     url(r'^events/consensus/?$', 'GoBoard.views.events.send_weekly_consensus',),

     #Views for ads.
     url(r'^ads/get/?$', 'GoBoard.views.ads.load_banner',),
     url(r'^ads/manage/?$', 'GoBoard.views.ads.manager',),
     url(r'^ads/form/(?P<did>[0-9]*)/?$', 'GoBoard.views.ads.form',),
     url(r'^ads/delete/(?P<did>[0-9]+)/?$', 'GoBoard.views.ads.delete',),
     url(r'^ads/submit/$', 'GoBoard.views.ads.submit', name="submitAd"),

     #Views for user cards.
     url(r'^cards?/?$', 'GoBoard.views.cards.load_cards', name="cards"),
     url(r'^deleteCard/?$', 'GoBoard.views.cards.delete_card',),
     url(r'^addCard/?$', 'GoBoard.views.cards.add_card',),
     url(r'^get_available_cards/?$', 'GoBoard.views.cards.get_available_cards',),

     #Views specific to cards.
     url(r'^get_SEPTA_times/?$', 'GoBoard.views.cards.get_SEPTA_times',),
     url(r'^get_calendar_events/?$', 'GoBoard.views.cards.get_calendar_events',),
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

