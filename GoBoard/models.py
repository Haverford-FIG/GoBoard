from django.db import models
from django.contrib.auth.models import User

class Message(models.Model):
  user = models.ForeignKey(User, unique = False)
  text = models.CharField(max_length=300)
  tags_required = models.BooleanField()
  datetime = models.DateTimeField(auto_now_add=True)

  def __unicode__(self):
    text = self.text if len(self.text)>20 else "{}...".format(self.text)
    return "\"{}\" -- {}".format(text, self.user.username)
	
class Tag(models.Model):
	tag = models.CharField(max_length=30)
	message = models.ManyToManyField(Message)

	def __unicode__(self):
		return self.tag

