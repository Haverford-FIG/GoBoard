from django.db import models
from django.contrib.auth.models import User

class Message(models.Model):
	user = models.ForeignKey(User, unique = False)
	text = models.CharField(max_length=300)
	tags_required = models.BooleanField()
	datetime = models.DateTimeField()

class Tags(models.Model):
	tag = models.CharField(max_length=30)
	message = models.ManyToManyField(Message)
