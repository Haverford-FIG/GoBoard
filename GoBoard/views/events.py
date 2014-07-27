from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_http_methods

from datetime import datetime
from GoBoard.models import Event
@login_required
@require_http_methods(["POST"])
def submit(request):
  try:
    form = request.POST

    dateFormat = "%m/%d/%Y%I:%M%p"
    start= datetime.strptime(form["startDate"]+form["startTime"], dateFormat)
    end = datetime.strptime(form["endDate"]+form["endTime"], dateFormat)

    did = request.POST["did"]
    try:
      event = getEnabledEvents(request.user).get(id=did)

      #If an `Event` is inactive, duplicate it rather than edit the original.
      assert event.isActive()
    except:
      event = Event()

    event.title = form["title"]
    event.location = form["location"]
    event.description = form["description"]
    event.category = form["category"]
    event.infoURL = form["infoURL"]

    event.startTime = start
    event.endTime = end

    #Manage Checkboxes

    event.weeklyConsensus = form["weeklyConsensus"]=="y"
    event.weeklyEvent = form["weeklyEvent"]=="y"

    #Don't overwrite the original author.
    if not event.author_id:
      event.author = request.user

    #When an edit has been performed, "unapprove" the event.
    event.approved = False

    #Only let `eventManagers` approve events.
    if request.user.groups.filter(name="eventManager").exists():
      event.approved = form["approved"]=="y"


    event.save()

    return HttpResponse("SUCCESS HOME")

  except Exception as e:
    print e
    return HttpResponse("ERROR")


from GoBoard.models import Event
@login_required
def form(request, did=0):
  try:
    event = getEnabledEvents(request.user).get(id=did)
  except:
    event = None

  managerView =  request.user.groups.filter(name="eventManager").exists()

  print managerView
  return render(request, "eventCreationScreen.html", {
    "event":event,
    "managerView":managerView,
  })


@login_required
def delete(request, did):
  try:
    from GoBoard.models import Event

    #Allow Event Managers to delete any event.
    if request.user.groups.filter(name="eventManager").exists():
      event = getEnabledEvents().get(id=did)
    else:
      event = getEnabledEvents(request.user).get(id=did)

    event.enabled = False
    event.save()
    return HttpResponse("SUCCESS")
  except:
    return HttpResponse("ERROR")

@login_required
def manager(request):
  from GoBoard.models import Event

  managerView =  request.user.groups.filter(name="eventManager").exists()

  events = getEnabledEvents(request.user).order_by("-endTime")

  return render(request, "eventManager.html", {
    "events":events,
    "managerView":managerView,
  })


@login_required
def send_weekly_consensus(request):
  from GoBoard.emailFunctions import email_weekly_consensus
  result = email_weekly_consensus()
  return HttpResponse(result)

def categorizeEvents(events):
  categories = events.values_list("category").distinct()
  categorizedEvents = {category[0]:[] for category in categories}

  #Put each event in its proper category.
  for event in events:
    categorizedEvents[event.category].append(event)

  return categorizedEvents

def getEnabledEvents(user=None):
  from GoBoard.models import Event
  events = Event.objects.filter(enabled=True)

  if user:
    events = events.filter(author=user)

  return events

def getActiveEvents(user=None):
  from datetime import datetime
  events = getEnabledEvents(user).filter(endTime__gte = datetime.now())
  return events


def getApprovedEvents(user=None):
  events = getActiveEvents(user).filter(approved=True)
  return events

