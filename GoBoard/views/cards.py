from django.http import HttpResponse
from django.shortcuts import render

from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_http_methods

from GoBoard import settings
import json

def load_cards(request):
  u = request.user

  #Load either the user's cards or the default cards.
  cards = u.userinfo.getCards() if u.is_authenticated() else settings.DEFAULT_CARDS

  return render(request, "cardsPage.html", {
    "cards":cards,
    "settings":settings,
  })


@login_required
@require_http_methods(["POST"])
def delete_card(request):
  u = request.user

  try:
    #Attempt to remove the card from the user's cardList.
    cardName = request.POST["cardName"]
    u.userinfo.deleteCard(cardName)

    return HttpResponse("0") #Success
  except:
    return HttpResponse("1") #Error


@login_required
@require_http_methods(["POST"])
def add_card(request):
  u = request.user

  try:
    #Attempt to remove the card from the user's cardList.
    cardName = request.POST["cardName"]
    u.userinfo.addCard(cardName)

    return HttpResponse("0") #Success
  except:
    return HttpResponse("1") #Error

def get_available_cards(request):
  cards = list(settings.AVAILABLE_CARDS)
  return HttpResponse(json.dumps(cards), content_type="application/json")



# # # # # # # # # # #   Card-Specific Views   # # # # # # # # # #

import urllib2
@require_http_methods(["POST"])
def get_SEPTA_times(request):
  linkBase = "http://app.septa.org/nta/result.php?"
  locAPrefix = "loc_a=";
  locZPrefix = "&loc_z=";

  #Get the SEPTA location URLs that correspond with two locations.
  locA = settings.SEPTA_LOCATIONS[ request.POST["locA"] ]
  locZ = settings.SEPTA_LOCATIONS[ request.POST["locZ"] ]

  link = linkBase + locAPrefix + locA + locZPrefix + locZ;
  url = urllib2.urlopen(linkBase + locAPrefix + locA + locZPrefix + locZ)
  content = url.read()

  return HttpResponse(content)


import requests, bs4, datetime
def get_clerk_articles(request):
  maxArticles = 3
  url = "http://haverfordclerk.com/rss/"

  def getArticle(item):
    #Put the date in a good format.
    dateString = item.find("pubDate").text
    preFormat = "%a, %d %b %Y %H:%M:%S"
    postFormat = "%B %d, %Y"
    cleanDateString = "".join(dateString.split(" +")[:-1])
    dt = datetime.datetime.strptime(cleanDateString, preFormat)
    formattedDate = dt.strftime(postFormat)

    return {
             "title":item.find("title").text,
             "link":item.find("link").text,
             "pubDate":formattedDate,
           }

  response = requests.get(url)
  rawFeed = response.text
  parsedXML = bs4.BeautifulSoup(rawFeed, features="xml")

  articles = [getArticle(item) for item in parsedXML.find_all("item")]
  articles = articles[:maxArticles]

  return HttpResponse(json.dumps(articles), content_type="application/json")




