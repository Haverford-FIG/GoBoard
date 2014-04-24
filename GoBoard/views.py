from django.http import HttpResponse, Http404
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
    tags = request.POST["tags"].split("#")

    #Store the messages and tags.
    store_message(message, tags, u, tagCheck)

    return HttpResponse("All set!")

  except Exception as e:
    print e
    #If something goes wrong, send the 500 page.
    return HttpResponse("ERROR")

@require_http_methods(["GET"])
def send_messages(request):
  try:
    print "SEND MESSAGE!!!"
    #Variable Setup
    u = request.user
    tags = request.GET["tags"].split("#")[1:]

    #TODO: DEBUG!
    for entry in Tag.objects.all():
      print "ITERATION"
      print entry
    #try:
    #  time = datetime.datetime.strptime(request.GET["time"] %)
    #except:

    if len(tags)>0:
      #Create a Q (complex query) object for each tag.
      qList = [Q(tag=queried_tag) for queried_tag in tags]

      #Create the query itself in the form: Q(content) | Q(content) | Q(content) ...
      query = qList.pop()
      for item in qList:
        query |= item
      messages = Message.objects.filter(query)[:30] #TODO: MAKE ME A BETTER PAGIFIER
    else:
      messages = Message.objects.all()[:30] #TODO: MAKE ME A BETTER PAGIFIER

    #Actually query the database.
    myQuerySet = Message.objects.all()

    if not messages.exists():
      response = {"error":"No messages found! :("}
    else:
      #Construct the JSON response.
      response = [{"text":message.text, "user":message.user.username, "tags":list(message.tag_set.all()), "datetime":str(message.datetime)} for message in messages]
    
  except Exception as e:
    print e
    #If something goes wrong, send the 500 page.
    response = {"error":"Oops! No messages could be loaded..."}

  #Send the JSON response.
  return HttpResponse(json.dumps(response), content_type="application/json")

def get_tags():
  tags = "#".join([entry.tag for entry in Tag.objects.all()])
  return HttpResponse(tags)
 
