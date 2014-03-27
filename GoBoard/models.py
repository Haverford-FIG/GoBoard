from django.db import models
from django.contrib.auth import user

class Message(models.Model):
	user = models.ForeignKey(User, unique = False)
	text = models.CharField(max_length=300)
	tags_requiered = models.BooleanField
	datetime = models.DateField([auto_now=False, auto_now_add=False])

class Tags(models.Model):
	tag = models.CharField(max_length=30)
	message = models.ManyToManyField(Message)
