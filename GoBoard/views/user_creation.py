from django.http import HttpResponse
from django.shortcuts import render
from django.db.models import Q
from GoBoard.views.authentication import validate_login
from GoBoard.settings import CAMPUS_OPTIONS
from GoBoard.models import User, UserInfo
from GoBoard.validation import valid_username, valid_email, valid_grad_year

def createUser(kwargs):
  #Make a new User object for the user.
  u = User()
  for key in ["username","email","first_name","last_name"]:
    setattr(u, key, kwargs[key])

  #Get the user's password from the kwargs.
  password = kwargs.get("password","")
  if not password: password = kwargs["newPass"]

  u.set_password(password)

  #Save the User object to give it an id which will allow
  #  us to link the UserInfo object below with this User.
  u.save()

  #Make a new UserInfo object for the user.
  ui = UserInfo()
  for key in ["grad_year", "campus"]:
    setattr(ui, key, kwargs[key])

  #Make a ForeignKey between the User and UserObject and save.
  ui.user = u
  ui.save()

  return u
 

def create_user(request):
  if request.method=="POST":
    #Variable Setup.
    username = request.POST.get("username")
    email = request.POST.get("email")
    password = request.POST.get("newPass")
    gradYear = request.POST.get("grad_year")

    #Make sure no username or email is duplicated.
    if not valid_username(username):
      return HttpResponse("ERROR USERNAME")
    if not valid_email(email):
      return HttpResponse("ERROR EMAIL")
    if gradYear and not valid_grad_year(gradYear):
      return HttpResponse("ERROR GRAD")
    if not password or password!=request.POST.get("newPassRepeat"):
      return HttpResponse("ERROR PASS")

    kwargs = {key:request.POST[key] for key in request.POST}
    newUser = createUser(kwargs)

    if validate_login(username, password, request):
      return HttpResponse("NEXT")

    print request.POST
    return HttpResponse("ERROR")

  else:
    return render(request, "userCreationScreen.html", {
      "campus_options":CAMPUS_OPTIONS
    })


