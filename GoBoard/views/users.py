from django.http import HttpResponse
from GoBoard.models import User
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_http_methods
import json

#Returns the "#text" of a QuerySet of Tags.
def getUsernameStrings(users):
  return ["@{}".format(user.username) for user in users]

#Returns a JSON-formatted list of all usernames with an "@" prefix.
@login_required
@require_http_methods(["GET"])
def get_usernames(request):
  users = User.objects.all()
  usernames = getUsernameStrings(users)

  return HttpResponse(json.dumps(usernames), content_type="application/json")



def get_mention_list(message):
  userList = []
  try:
    #If there are no tags, don't make a list of None objects.
    if message.mentions.exists():
      userSet = message.mentions.all()
      userList = list(userSet)
  except Exception as e:
    print e
    print "ERROR GETTING MESSAGE MENTIONS: {}".format(message)
  return userList
