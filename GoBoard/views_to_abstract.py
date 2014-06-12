from django.http import StreamingHttpResponse, HttpResponse, Http404
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_http_methods
from django.db.models import Q

from models import *
from models_constructors import *
from GoBoard.sessionCounter import getActiveUsers
from GoBoard.views.tags import getTagStrings, get_tag_list
from GoBoard.views.users import getUsernameStrings, get_mention_list
from GoBoard.settings import MESSAGES_PER_TRANSACTION

import operator
import datetime
import json

def main_page(request):
	u = request.user
        style = "pastel" if not u.is_authenticated() else u.userinfo.theme
	return render(request, "index_{}.html".format(style))

#Store a message in the database.
@login_required
@require_http_methods(["POST"])
def new_message(request):
  try:
    #Variable Setup
    u = request.user
    message = request.POST["message"]
    tagCheck = request.POST["tagCheck"]
    tags = request.POST.getlist("tags[]")
    private = request.POST.get("private")=="true"

    #Store the messages and tags.
    store_message(message, tags, u, tagCheck, private)

    return HttpResponse("All set!")

  except Exception as e:
    print e
    #If something goes wrong, send the 500 page.
    return HttpResponse("ERROR")

def get_messages(tagBasedQuery, page=1, private=False, user=None):
  #Variable Setup.
  page_size = MESSAGES_PER_TRANSACTION

  #Make sure to grab only the private messages to which this user has access.
  if user is not None and user.is_authenticated():
    #Grab any private message that the user is mentioned in or is the author of.
    userBasedQuery = (Q(private=True, mentions__in=[user.id])|
                      Q(private=True, user=user))

    #If the user doesn't want JUST private messages, give them non-private as well.
    if not private: 
      userBasedQuery |= Q(private=False)
  else:
    #Non-members cannot have private messages.
    userBasedQuery = Q(private=False)

  #Actually apply the "private" query.
  messages = Message.objects.filter(userBasedQuery)
  
  #If there is a "tag" query to perform, do that as well.
  if tagBasedQuery:
    messages = messages.filter(tagBasedQuery)

  #Order the messages.
  messages = messages.order_by("-datetime")

  return messages[page_size*(page-1):page_size*page]


def get_tag_list(message):
  tagList = []
  try:
    #If there are no tags, don't make a list of None objects.
    if message.tag_set!=None:
      tagSet = message.tag_set.all()
      tagList = list(tagSet)
    else:
      tagList=[]
  except Exception as e:
    print e
    print "ERROR GETTING MESSAGE TAGS: {}".format(message)
  return tagList

@require_http_methods(["GET"])
def send_messages(request):
  try:
    #Variable Setup
    u = request.user
    tags = request.GET.getlist("tags[]")
    page = 1 if not request.GET.get("page") else int(request.GET["page"])
    private = request.GET.get("private")
    if private: private = private=="true" #Javascript uses lowercase.
    query = None

    if len(tags)>0:
      #Create a Q (complex query) object for each tag based on the tag's tag field.
      #The format below is: Q(object__field=value)
      qList = []
      for query_bit in tags:
        if query_bit[0]=="@":
          name = query_bit[1:]
          userTest = User.objects.filter(username=name)
          if userTest.exists():
            otherUser = userTest.first()
            qList.append(Q(user__username=name)|Q(mentions__in=[otherUser.id]))
        else:
          if query_bit[0]=="#": query_bit = query_bit[1:]
          qList.append(Q(tag__tag=query_bit))

      #Create the query itself in the form: Q(content) | Q(content) | Q(content) ...
      query = reduce(operator.or_, qList)
 
    messages = get_messages(query, page=page, private=private, user=u)

    if not messages.exists():
      response = {"maxPage":True}
    else:
      #Construct the JSON response.
      response = [{"text":message.text, 
                   "user":message.user.username, 
                   "tags":getTagStrings(get_tag_list(message)), 
                   "mentions":getUsernameStrings(get_mention_list(message)), 
                   "private":message.private,
                   "datetime":str(message.datetime)} for message in messages]
   
  except Exception as e:
    print "send_messages error: {}".format(e)
    #If something goes wrong, send the 500 page.
    response = {"error":"Oops! We can't seem to load those messages..."}

  #Send the JSON response.
  return HttpResponse(json.dumps(response), content_type="application/json")



def createUserFromString(name):
  newUser = User(username=name, password=DEFAULT_USER_PASSWORD)
  newUser.save()
  return newUser
