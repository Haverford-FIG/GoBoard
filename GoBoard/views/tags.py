from django.shortcuts import render
from django.http import HttpResponse
from django.db.models import Count
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_http_methods

from GoBoard.models import Tag
from GoBoard.settings import MAX_UPDATE_CONTAINER_ENTRIES
import datetime
import json

#Accessor used to get tags. TODO: Will be useful if we decide to
# "limit" the tags that users are able to see -- as in have "private"
# tags.
def getTags(private=None):
  return Tags.objects.all(private=None)

#Returns the "#text" of a QuerySet of Tags.
def getTagStrings(tags):
  return ["#{}".format(entry.tag) for entry in tags]

def getRecentTags(limit=MAX_UPDATE_CONTAINER_ENTRIES):
  return Tag.objects.order_by("-message__datetime")[:limit]

#For more on the "aggregation" techniques used below:
# https://docs.djangoproject.com/en/dev/topics/db/aggregation/
def getTrendingTags(limit=MAX_UPDATE_CONTAINER_ENTRIES):
  #Get the tags within the last month.
  today = datetime.datetime.now()
  lastMonth = today - datetime.timedelta(days=30)
  tags = Tag.objects.filter(message__datetime__gte=lastMonth)

  #Get the occurrences of "#text" in those tags.
  tagVals = tags.annotate(c=Count('tag')).order_by('-c')

  return tagVals[:limit]


def get_tags(request, query=None):
  try:
    if query=="recent":
      tagList = getRecentTags()
    elif query=="trending":
      tagList = getTrendingTags()
    else:
      tagList = Tag.objects.all()

    tags = getTagStrings(tagList)
    return HttpResponse(json.dumps(tags), content_type="application/json")
  except Exception as e:
    print e
    return HttpResponse("ERROR")


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


@login_required
def get_followed_tags(request):
  #Get the tags that this user has followed.
  tags = Tag.objects.filter(following__in=[request.user.id])
  tags = tags.order_by("tag")

  return render(request, "followedTagsManager.html", {
    "tags": tags
  })


@require_http_methods(["POST"])
@login_required
def follow_delete(request):
  try:
    tagText = request.POST["tag"]
    tag = Tag.objects.get(tag=tagText)
    tag.following.remove(request.user)
    tag.save()
    return HttpResponse("SUCCESS")
  except Exception as e:
    print e
    return HttpResponse("ERROR")


@require_http_methods(["POST"])
@login_required
def follow_new(request):
  try:
    tagText = request.POST["tag"]
    tag = Tag.objects.get(tag=tagText)
    tag.following.add(request.user)
    tag.save()
    return HttpResponse("SUCCESS")
  except Exception as e:
    print e
    return HttpResponse("ERROR")

