from django.conf.urls import patterns, include, url

urlpatterns = patterns('',
    # Examples:
     url(r'^$', 'GoBoard.views.main_page',),
     url(r'^home/?$', 'GoBoard.views.main_page',),

     url(r'^new_message/?$', 'GoBoard.views.new_message',),
     url(r'^get_messages/?$', 'GoBoard.views.send_messages',),

     url(r'^get_tags/?$', 'GoBoard.views.get_tags',),
)
