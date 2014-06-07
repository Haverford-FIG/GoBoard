from django.http import HttpResponse
from django.contrib.auth.models import User
from django.contrib.sessions.models import Session
from datetime import datetime

#Mostly taken from: http://stackoverflow.com/questions/2723052/how-to-get-the-list-of-the-authenticated-users 
def getActiveUsers():
  sessions = Session.objects.filter(expire_date__gte=datetime.now())
  uid_list = [s.get_decoded().get("_auth_user_id", None) for s in sessions]
  return User.objects.filter(id__in=uid_list)  

#Sends a raw number back detailing how many users are logged in.
def sendActiveUserCount(request):
  return HttpResponse(getActiveUsers().count())
