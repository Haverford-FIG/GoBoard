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


@require_http_methods(["POST"])
def get_SEPTA_times(request):
  import urllib2
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


def get_rss_articles(request, url="", maxArticles=3):
  import requests, bs4, datetime
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


def get_calendar_events(request):
  import requests, bs4, datetime, re
  try:
    #Convert the date into an RSS-comparable form.
    rawDate = request.GET["date"]
    preFormat = "%m/%d/%Y"
    postFormat = "%a, %d %b %Y"
    dt = datetime.datetime.strptime(rawDate, preFormat)
    date = dt.strftime(postFormat)

    def getEvent(item):
      #Get the link and the event title.
      rawTitle = item.find("title").text
      title = re.findall(r"<a.*?>(.*?)</a>", rawTitle)[0]
      link = re.findall(r"<a.*?href=\"(.*?)\".*?>.*?</a>", rawTitle)[0]

      #Get the time.
      rawTime = item.find("pubDate").text
      preFormat = "%a, %d %b %Y %H:%M:%S EDT"
      postFormat = "%I:%M%p"
      dt = datetime.datetime.strptime(rawTime, preFormat)
      time = dt.strftime(postFormat)

      return {
               "title":title,
               "link":link,
               "time":time,
             }


    #Query the calendar to the events starting on a given day.
    url = "http://www.haverford.edu/calendar/rss/?date="
    url += dt.strftime("%Y%m%d")
    response = requests.get(url)
    rawFeed = response.text
    parsedXML = bs4.BeautifulSoup(rawFeed, features="xml")

    items = parsedXML.find_all("item")
    events = []
    for item in items:
      rawQueryDate = item.find("pubDate").text
      queryDate = rawQueryDate.split(":")[0][:-3]
      if queryDate==date:
        events.append(getEvent(item))

  except:
    events = []
  return HttpResponse(json.dumps(events), content_type="application/json")


def get_BlueBus_locations(request):
  def getDay(timestring=None):
    import datetime
    if not timestring: #TODO: Expand to custom timestring
      time = datetime.datetime.now()

    day = ["Mo","Tu","We","Th","Fr","Sa","Su"][time.weekday()]
    if day in {"Sa", "Su"}:
      return "Saturday Daytime" if (day=="Sa" and time.hour<15) else "Weekend"
    else:
      return "Weekday"

  from GoBoard.settings import BLUE_BUS_LOCATIONS
  timestring = request.GET.get("", None)
  locations = BLUE_BUS_LOCATIONS[getDay(timestring=timestring)]
  return HttpResponse(json.dumps(locations), content_type="application/json")




