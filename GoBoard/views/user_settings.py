from django.http import HttpResponse
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_http_methods
from GoBoard.settings import CAMPUS_OPTIONS, THEME_OPTIONS
from GoBoard.validation import valid_username, valid_email, valid_grad_year
from GoBoard.views.forgot_password import changeUserPassword

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

  #Shorten the form name a bit for our own sake...
  form = request.POST

  #Verify the user's current password.
  password = form.get("currentPass","")
  if not u.check_password(password): return HttpResponse("ERROR PASS")

  #Make sure no email is duplicated.
  newEmail = form.get("email")
  if not valid_email(newEmail) and u.email!=u.email:
    return HttpResponse("ERROR EMAIL")

  newGradYear = form.get("grad_year")
  if newGradYear and not valid_grad_year(newGradYear):
    return HttpResponse("ERROR GRAD")

  #Change the user's email preferences.
  emailFields = ["new_messages","tag_updates","weekly_work","weekly_consensus"]
  for field in emailFields:
    field = "email_about_{}".format(field)
    setattr(u.userinfo, field, form.get(field,"y")=="y")

  #Change the user's other information (ie: "user.userinfo.FIELD").
  otherInfoFields = ["campus", "grad_year"]
  for field in otherInfoFields:
    setattr(u.userinfo, field, form.get(field,""))

  #Change the actual "user" fields (ie: "user.FIELD").  
  userFields = ["first_name", "last_name", "email"]
  for field in userFields:
    setattr(u, field, form.get(field,""))

  #Change the user's password if requested.
  newPass= form.get("newPass","")
  if newPass and form.get("newPassRepeat","")==newPass:
    changeUserPassword(u, newPass)

  #Save the changes.
  u.userinfo.save()
  u.save()

  return HttpResponse("SUCCESS")


