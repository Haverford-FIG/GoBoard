from django.db import models
from django.contrib import admin
from django.contrib.auth.models import User
from datetime import datetime

from GoBoard import settings

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


admin.site.register(Message)
admin.site.register(Tag)
admin.site.register(UserInfo)
