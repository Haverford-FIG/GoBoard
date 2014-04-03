from django.http import HttpResponse, Http404
from django.template import RequestContext
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_http_methods
from django.db.models import Q

from models import *
from models_constructors import *

def main_page(request):
 	return render(request, "index.html")

#Store a message in the database.
@login_required
@require_http_methods(["POST"])
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

  except:
    #If something goes wrong, send the 500 page.
    return HttpResponse("ERROR")

@require_http_methods(["GET"])
def send_messages(request):
  try:
    #Variable Setup
    u = request.user
    tags = request.GET["tags"].split("#")

    #Create a Q (complex query) object for each tag.
    qList = [Q(tag=queried_tag) for queried_tag in tags]

    #Create the query itself in the form: Q(content) | Q(content) | Q(content) ...
    query = qList.pop()
    for item in qList:
      query |= item

    #Actually query the database.
    messages = Message.object.filter(query)[:30] #TODO: MAKE ME A BETTER PAGIFIER

    #Construct the JSON response.
    response = [{"text":message.text, "user":message.user.username, "tags":list(message.tag_set.all()), "datetime":str(message.datetime)} for message in messages]
    
    #Send the JSON response.
    return response

  except:
    #If something goes wrong, send the 500 page.
    return HttpResponse("ERROR")

def get_tags():
  tags = "#".join([entry.tag for entry in Tag.objects.all()])
  return HttpResponse(tags)
 
