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


def getTime(timestring):
  import datetime
  if not timestring: #TODO: Expand to custom timestring
    time = datetime.datetime.now()

  days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]
  day = days[time.weekday()]
  if day == "Saturday" and time.hour<15:
    day = "Saturday Daytime"

  return (day, time)


def getSchedule(timestring):
  day, time = getTime(timestring)

  if day=="Saturday Daytime":
    return "Saturday Daytime"
  elif "Saturday" in day or "Sunday" in day:
    return "Weekend"
  else:
    return "Weekday"


def get_BlueBus_times(request):
  def militaryTime(time):
    if time=="":
      return ""
    elif time[:2]=="12" and time[-2:]=="AM":
      colon = time.index(":")
      return "00:{}".format(time[colon+1:-2])
    elif time[-2:]=="PM":
      colon = time.index(":")
      hour = "12" if time[:2] == "12" else int(time[:colon])+12
      return "{}:{}".format(hour, time[colon+1:-2])
    else:
      colon = time.index(":")
      hour = int(time[:colon])
      return "0"+time[:-2] if hour<10 else time[:-2]

  def unmilitaryTime(time):
    colon = time.index(":")
    hour = time[:colon]
    minute = time[colon+1:]
    if hour>"12":
      return "{}:{}PM".format(int(hour)-12, minute)
    elif hour=="12":
      return "12:{}PM".format(minute)
    elif hour=="00":
      return "12:{}AM".format(minute)
    else:
      return "{}:{}AM".format(hour, minute)

  def getNextBuses(start, timestring=None, limit=4):
    def getBlueBusMatrix(day):
      with open("GoBoard/dataFiles/bluebus.txt","r") as f:
        read = False
        lines = []
        for line in f.readlines():
          if day in line:
            read = True
          elif read:
            if line=="\n":
              break
            else:
              lines.append(line.replace("\n","").split(" "))

      # Convert the times to military times (for easy comparison).
      return [lines[0]]+[map(militaryTime, row) for row in lines[1:]]

    day, raw_time = getTime(timestring)
    time = raw_time.strftime("%H:%M")
    matrix = getBlueBusMatrix(day)

    headers = matrix.pop(0)

    start = start.replace(" ","_") #TODO: Naive and fails on Saturday Daytime
    if "Leave_{}".format(start) in headers:
      col = headers.index("Leave_{}".format(start))

    # Get all the bus times after the first available bus time (since time-sorted).
    for i, row in enumerate(matrix):
      if row[col]>time:
        bus_times = [row[col] for row in matrix[i:]]
        return bus_times[:limit]

    return []

  try:
    # Variable Setup
    start = request.GET["start"]
    end = request.GET["end"]
    timestring = request.GET.get("datetime",None)

    times = getNextBuses(start, timestring=timestring)


    times = [unmilitaryTime(time) for time in times]
  except Exception as e:
    print e
    times = ["No more today..."]
  return HttpResponse(json.dumps(times), content_type="application/json")


def get_BlueBus_locations(request):
  from GoBoard.settings import BLUE_BUS_LOCATIONS
  timestring = request.GET.get("", None)
  locations = BLUE_BUS_LOCATIONS[getSchedule(timestring=timestring)]
  return HttpResponse(json.dumps(locations), content_type="application/json")




