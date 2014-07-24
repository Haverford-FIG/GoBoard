from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_http_methods

def load_banner(request):
  ad = getNextAd()

  if not ad:
    ad = Ad.objects.filter(text="Submit your own HaverAd!").first()

  # Give this `ad` another "view" count.
  ad.incrementViews()

  return render(request, "adBanner.html", {
    "ad":ad,
  })


from datetime import datetime
from GoBoard.models import Ad
@login_required
@require_http_methods(["POST"])
def submit_ad_form(request):
  try:
    form = request.POST

    dateFormat = "%m/%d/%Y"
    start= datetime.strptime(form["startDate"], dateFormat)
    end = datetime.strptime(form["endDate"], dateFormat)

    did = request.POST["did"]
    try:
      ad = getEnabledAds(request.user).get(id=did)

      #If an `Ad` is inactive, duplicate it rather than edit the original.
      assert ad.isActive()
    except:
      ad = Ad()

    ad.text = form["text"]
    ad.imageURL = form["imageURL"]
    ad.infoURL = form["infoURL"]
    ad.size = form["size"]
    ad.startDate = start
    ad.endDate = end
    ad.author = request.user
    ad.save()

    return HttpResponse("SUCCESS HOME")

  except Exception as e:
    print e
    return HttpResponse("ERROR")

from GoBoard.models import Ad
@login_required
def create_ad_form(request, did=0):
  try:
    ad = getEnabledAds(request.user).get(id=did)
  except:
    ad = None
  return render(request, "adCreationScreen.html", {
    "ad":ad
  })

@login_required
def delete_ad(request, did):
  try:
    from GoBoard.models import Ad
    ad = getEnabledAds(request.user).get(id=did)
    ad.enabled = False
    ad.save()
    return HttpResponse("SUCCESS")
  except:
    return HttpResponse("ERROR")

@login_required
def ad_manager(request):
  from GoBoard.models import Ad
  ads = getEnabledAds(request.user).order_by("-endDate")
  return render(request, "adManager.html", {
    "ads":ads
  })


def getEnabledAds(user=None):
  from GoBoard.models import Ad
  ads = Ad.objects.filter(enabled=True)

  if user:
    ads = ads.filter(author=user)

  return ads

def getActiveAds(user=None):
  from datetime import datetime
  from GoBoard.models import Ad

  date = datetime.now()
  dateNoTime = datetime(date.year, date.month, date.day)
  ads = getEnabledAds(user).filter(endDate__gte=dateNoTime, size="banner")

  return ads

def getNextAd():
  ads = getActiveAds().order_by("views")

  return ads.first()

