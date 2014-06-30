from django.db import models
from django.contrib import admin
from django.contrib.auth.models import User
from datetime import datetime

import json

class Message(models.Model):
  user = models.ForeignKey(User, unique = False)
  text = models.CharField(max_length=300)
  tags_required = models.BooleanField()
  private = models.BooleanField(default=False)
  mentions = models.ManyToManyField(User, related_name="mentions",
                                   default=None, null=True)
  datetime = models.DateTimeField(auto_now_add=True)

  def __unicode__(self):
    text = self.text if len(self.text)>20 else "{}...".format(self.text)
    return "\"{}\" -- {}".format(text, self.user.username)



class Tag(models.Model):
  tag = models.CharField(max_length=30)
  message = models.ManyToManyField(Message)

  def __unicode__(self):
    return self.tag



class UserInfo(models.Model):
  user = models.OneToOneField(User)
  email_about_weekly_work = models.BooleanField(default=True)
  email_about_weekly_consensus = models.BooleanField(default=True)
  email_about_new_messages = models.BooleanField(default=True)
  email_about_tag_updates = models.BooleanField(default=True)
  grad_year = models.IntegerField(default=lambda: datetime.now().year,
                                  blank=True, null=True)
  theme = models.CharField(max_length=150, default="pastel")
  campus = models.CharField(max_length=150, default="Haverford")

  defaultCards = models.TextField(default="[]") #Should be valid JSON.

  def __unicode__(self):
    return "Info for '{}'".format(self.user.username)

  def getCards(self):
    return json.loads(self.defaultCards)



admin.site.register(Message)
admin.site.register(Tag)
admin.site.register(UserInfo)
