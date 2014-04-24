from django.http import StreamingHttpResponse, HttpResponse, Http404
from django.template import RequestContext
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_http_methods
from django.db.models import Q

from models import *
from models_constructors import *

import datetime
import json

def main_page(request):
 	return render(request, "index.html")

#Store a message in the database.
#@login_required
#@require_http_methods(["POST"])
def new_message(request):
  try:
    #Variable Setup
    u = request.user
    message = request.POST["message"]
    tagCheck = request.POST["tagCheck"]
    tags = request.POST.getlist("tags")

    #Store the messages and tags.
    store_message(message, tags, u, tagCheck)

    return HttpResponse("All set!")

  except Exception as e:
    print e
    #If something goes wrong, send the 500 page.
    return HttpResponse("ERROR")

def get_messages(query):
  #Variable Setup.
  num_messages = 30

  #Get the messages.
  if query==None:
    messages = Message.objects.all()
  else:
    messages = Message.objects.filter(query)

  #Order the messages.
  messages = messages.order_by("-datetime")

  return messages[:num_messages]

def get_tag_list(message):
  tagList = list(message.tag_set.all())
  return tagList

@require_http_methods(["GET"])
def send_messages(request):
  try:
    #Variable Setup
    u = request.user
    tags = request.GET.getlist("tags")
    query = None

    if len(tags)>0:
      #Create a Q (complex query) object for each tag.
      qList = [Q(tag=queried_tag) for queried_tag in tags]

      #Create the query itself in the form: Q(content) | Q(content) | Q(content) ...
      query = qList.pop()
      for item in qList:
        query |= item

    messages = get_messages(query)

    if not messages.exists():
      response = {"error":"No messages found! :("}
    else:
      #Construct the JSON response.
      response = [{"text":message.text, "user":message.user.username, "tags":get_tag_list(message), "datetime":str(message.datetime)} for message in messages]
   
  except Exception as e:
    print "send_messages error: {}".format(e)
    #If something goes wrong, send the 500 page.
    response = {"error":"Oops! No messages could be loaded..."}

  #Send the JSON response.
  return HttpResponse(json.dumps(response), content_type="application/json")

def get_tags(request):
  tags = ["#{}".format(entry.tag) for entry in Tag.objects.all()]
  return HttpResponse(json.dumps(tags), content_type="application/json")
 



