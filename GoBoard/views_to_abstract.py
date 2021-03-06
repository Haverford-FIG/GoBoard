from django.http import StreamingHttpResponse, HttpResponse, Http404
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_http_methods
from django.db.models import Q

from models import User, Message
from database_access import getMessages
from models_constructors import *
from GoBoard.sessionCounter import getActiveUsers
from GoBoard.views.tags import getTagStrings, get_tag_list
from GoBoard.views.users import getUsernameStrings, get_mention_list
from GoBoard.settings import MESSAGES_PER_TRANSACTION

import operator
import datetime
import json


@login_required
@require_http_methods(["GET"])
def load_chat(request):
  # Load any tags that are passed through the GET request.
  tags = request.GET.get("tags")
  if tags:
    tags = " ".join(["#"+tag if tag[0]!="@" else tag for tag in tags.split(",")])

  return render(request, "chatPage.html", {"tags": tags})

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

def get_messages(tagBasedQuery, private=False, user=None, lastID=None, loadMore=True):
  #Variable Setup.
  batch_size = MESSAGES_PER_TRANSACTION

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

  #Apply the "user-based" part of the query.
  messages = getMessages().filter(userBasedQuery)

  #If there is a "tag" query to perform, do that as well.
  if tagBasedQuery:
    for q in tagBasedQuery:
      messages = messages.filter(q)


  if lastID:
    lastMessage = Message.objects.filter(id=int(lastID)).first()
    if lastMessage:
      lastDate = lastMessage.datetime
      if loadMore:
        messages = messages.filter(datetime__lt=lastDate)
      else:
        messages = messages.filter(datetime__gt=lastDate)

  #Order the messages.
  messages = messages.order_by("-datetime")

  return messages[:batch_size]


@require_http_methods(["GET"])
def send_messages(request):
  try:
    #Variable Setup
    u = request.user
    tags = request.GET.getlist("tags[]")

    #Load parameters that may not exist in the request.
    private = request.GET.get("private")
    if private: private = private=="true" #Javascript uses lowercase.

    loadMore = request.GET.get("loadMore")
    if loadMore: loadMore = loadMore=="true" #Javascript uses lowercase.

    lastID = request.GET.get("lastID")
    if not lastID or lastID.lower()=="none": lastID=None


    if len(tags)>0:
      #Create a Q (complex query) object for each tag based on the tag's tag field.
      #The format below is: Q(object__field=value)
      qList = []
      for tag in tags:
        if tag[0]=="@":
          name = tag[1:]
          userTest = User.objects.filter(username=name)
          if userTest.exists():
            otherUser = userTest.first()
            qList.append(Q(user__username=name)|Q(mentions__in=[otherUser.id]))
        else:
          if tag[0]=="#":
            if Tag.objects.filter(tag=tag[1:]).exists():
              qList.append(Q(tag__tag=tag[1:]))
            else:
              response = {"error":"Tag '{}' does not exist!".format(tag)}
              jsonified = json.dumps(response)
              return HttpResponse(jsonified, content_type="application/json")

      #Create the query itself in the form: Q(content) | Q(content) | Q(content) ...
      #query = reduce(operator.and_, qList) if qList else []
      query = qList

    else:
      query = None

    messages = get_messages(query, private=private, user=u,
                            lastID=lastID, loadMore=loadMore)

    if not messages.exists():
      response = {"maxPage":True}
    else:
      #Construct the JSON response.
      response = [{"text":message.getCleanedText(),
                   "user":message.user.username,
                   "tags":getTagStrings(get_tag_list(message)),
                   "mentions":getUsernameStrings(get_mention_list(message)),
                   "private":message.private,
                   "pid":message.id,
                   "deletable":message.deletable(u),
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
