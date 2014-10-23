from django.db import models
from django.contrib import admin
from django.contrib.auth.models import User
from django.utils.html import escape
from datetime import datetime

from GoBoard import settings

import json

class Message(models.Model):
  user = models.ForeignKey(User, unique = False)
  text = models.CharField(max_length=300)
  tags_required = models.BooleanField(default=False)
  enabled = models.BooleanField(default=True)
  private = models.BooleanField(default=False)
  mentions = models.ManyToManyField(User, related_name="mentions",
                                   default=None, null=True)
  datetime = models.DateTimeField(auto_now_add=True)

  def __unicode__(self):
    text = self.text if len(self.text)>20 else "{}...".format(self.text)
    return "\"{}\" -- {}".format(text, self.user.username)

  def getCleanedText(self):
    cleanText = escape(self.text)
    return cleanText

  def isRecent(self):
    # If the Message is more than 3 hours old, don't let it be deleted.
    from datetime import datetime
    date = datetime.now()
    timeDiff = date - self.datetime
    return (timeDiff.days < 1 and timeDiff.seconds <= 3*3600)

  def deletable(self, user):
    return self.user==user and self.isRecent()



class UserInfo(models.Model):
  user = models.OneToOneField(User)

  email_about_weekly_work = models.BooleanField(default=True)
  email_about_weekly_consensus = models.BooleanField(default=True)
  email_about_mentions = models.BooleanField(default=True)
  email_about_tag_updates = models.BooleanField(default=True)

  grad_year = models.IntegerField(default=lambda: datetime.now().year,
                                  blank=True, null=True)
  theme = models.CharField(max_length=150, default="pastel")
  show_ads = models.BooleanField(default=True)
  campus = models.CharField(max_length=150, default="Haverford")

  # Start each user with the DEFAULT_CARDS specified in settings.
  cardList = models.TextField(default=json.dumps(settings.DEFAULT_CARDS))

  def __unicode__(self):
    return "Info for '{}'".format(self.user.username)

  def getCards(self):
    return json.loads(self.cardList)

  # Attempt to add a cardName to the cardList but fail if the cardName is invalid.
  def addCard(self, cardName):
    # Verify that the "cardName" is in fact an available card.
    if cardName not in settings.AVAILABLE_CARDS:
      raise Exception("cardName '"+cardName+"' not in settings.AVAILABLE_CARDS")

    cards = self.getCards()
    cards.append(cardName)
    self.replaceCards(cards)

  # Attempt to delete the cardName from the cardList but fail if impossible.
  def deleteCard(self, cardName):
    cards = self.getCards()
    cards.remove(cardName)
    self.replaceCards(cards)

  # Attempt to replace the cardList with a new list of cards, but fail if
  #   any of the cards is invalid.
  def replaceCards(self, cards):
    for card in cards:
      if card not in settings.AVAILABLE_CARDS:
        raise Exception("cardName '"+card+"' not in settings.AVAILABLE_CARDS")

    self.cardList = json.dumps(cards)

    self.save()

class Ad(models.Model):
  text = models.CharField(max_length=300, default="")
  imageURL = models.TextField(default="")
  infoURL = models.TextField(default="")
  startDate = models.DateTimeField()
  endDate = models.DateTimeField()
  size = models.TextField(default="banner")
  style = models.TextField(default="")

  views = models.IntegerField(default=0)
  author = models.ForeignKey(User, unique=False)
  enabled = models.BooleanField(default=True)

  def __unicode__(self):
    isActive = self.isActive()
    return "'{}' (Active: {}, Enabled: {})".format(self.text, isActive, self.enabled)

  def isActive(self):
    from datetime import datetime
    date = datetime.now()
    dateNoTime = datetime(date.year, date.month, date.day)
    return self.endDate >= dateNoTime


  def incrementViews(self):
    self.views = self.views+1
    self.save()

class Event(models.Model):
  title = models.CharField(max_length=300, default="")
  location = models.CharField(max_length=300, default="")
  description = models.TextField(default="")
  infoURL = models.TextField(default="")

  startTime = models.DateTimeField()
  endTime = models.DateTimeField()

  category = models.CharField(max_length=300, default="")
  weeklyEvent = models.BooleanField(default=False)
  weeklyConsensus = models.BooleanField(default=False)

  enabled = models.BooleanField(default=True)
  approved = models.BooleanField(default=False)
  author = models.ForeignKey(User, unique=False)

  def isActive(self):
    from datetime import datetime
    return self.endTime >= datetime.now()


class Tag(models.Model):
  tag = models.CharField(max_length=30)
  message = models.ManyToManyField(Message)
  event = models.ManyToManyField(Event)
  following = models.ManyToManyField(User, related_name="following",
                                   default=None, null=True)

  def __unicode__(self):
    return self.tag




admin.site.register(Message)
admin.site.register(Tag)
admin.site.register(Ad)
admin.site.register(Event)
admin.site.register(UserInfo)
