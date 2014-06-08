from django.http import HttpResponse
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_http_methods
from GoBoard.settings import CAMPUS_OPTIONS, THEME_OPTIONS

@login_required
@require_http_methods(["GET"])
def load_settings(request):
  u = request.user
  return render(request, "settingsMenu.html", {
    "campus_options":CAMPUS_OPTIONS,
    "theme_options":THEME_OPTIONS,
  })


@login_required
@require_http_methods(["POST"])
def update_settings(request):
  #Variable Setup.
  u = request.user 

  print request.POST
  #Verify the user's current password.
  password = request.POST.get("currentPass","")
  if not u.check_password(password): return HttpResponse("ERROR")

  #Change the user's email preferences.
  emailFields = ["new_messages","tag_updates","weekly_work","weekly_consensus"]
  for field in emailFields:
    field = "email_about_{}".format(field)
    print field
    print getattr(u.userinfo, field)
    setattr(u.userinfo, field, request.POST.get(field,"y")=="y")

  #Change the user's other information (ie: "user.userinfo.FIELD").
  otherInfoFields = ["campus"]
  for field in otherInfoFields:
    setattr(u.userinfo, field, request.POST.get(field,""))

  #Change the actual "user" fields (ie: "user.FIELD").  
  userFields = ["first_name", "last_name", "email"]
  for field in userFields:
    setattr(u, field, request.POST.get(field,""))

  #Change the user's password if requested.
  newPass= request.POST.get("newPass","")
  if newPass and request.POST.get("newPassRepeat","")==newPass:
    changeUserPassword(u, newPass)

  #Save the changes.
  u.userinfo.save()
  u.save()

  return HttpResponse("SUCCESS")


def changeUserPassword(user, password):
  user.set_password(password)
  user.save()

