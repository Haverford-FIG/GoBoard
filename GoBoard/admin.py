from django.contrib import admin

from GoBoard.models import Message, Tag, Ad, Event, UserInfo

admin.site.register(Message)
admin.site.register(Tag)
admin.site.register(Ad)
admin.site.register(Event)
admin.site.register(UserInfo)

