from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
     url(r'^$', 'GoBoard.views.main_page',),
     url(r'^new_message$', 'GoBoard.views.new_message',),


    url(r'^admin/', include(admin.site.urls)),
)

