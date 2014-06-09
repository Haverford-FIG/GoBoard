from django.http import StreamingHttpResponse, HttpResponse, Http404
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_http_methods
from django.db.models import Q

from models import *
from models_constructors import *
from GoBoard.sessionCounter import getActiveUsers

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

    #Store the messages and tags.
    store_message(message, tags, u, tagCheck)

    return HttpResponse("All set!")

  except Exception as e:
    print e
    #If something goes wrong, send the 500 page.
    return HttpResponse("ERROR")

def get_messages(query, page=1):
  #Variable Setup.
  page_size = 30

  #Get the messages.
  if query==None:
    messages = Message.objects.all()
  else:
    messages = Message.objects.filter(query)

  #Order the messages.
  messages = messages.order_by("-datetime")

  return messages[page_size*(page-1):page_size*page]

def convert_tag_list_to_text_list(tagList):
  return ["#{}".format(tag.tag) for tag in tagList]

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
    query = None

    if len(tags)>0:
      #Create a Q (complex query) object for each tag based on the tag's tag field.
      #The format below is: Q(object__field=value)
      qList = []
      for query_bit in tags:
        if query_bit[0]=="@":
          qList.append(Q(user__username=query_bit[1:]))
        else:
          if query_bit[0]=="#": query_bit = query_bit[1:]
          qList.append(Q(tag__tag=query_bit))

      #Create the query itself in the form: Q(content) | Q(content) | Q(content) ...
      query = reduce(operator.or_, qList)
 
    messages = get_messages(query, page)


    if not messages.exists():
      response = {"maxPage":True}
    else:
      #Construct the JSON response.
      response = [{"text":message.text, 
                   "user":message.user.username, 
                   "tags":convert_tag_list_to_text_list(get_tag_list(message)), 
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
