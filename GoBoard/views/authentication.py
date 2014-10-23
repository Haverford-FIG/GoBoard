from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse
from django.shortcuts import render

def validate_login(username, password, request):
  u = authenticate(username = username, password = password)
  if u is not None:
    if u.is_active:
      login(request, u)
      return True
  return False


def login_view(request):
  if request.method=="POST":
    username = request.POST.get("username","")
    password = request.POST.get("password","")
    if validate_login(username, password, request):
      return HttpResponse("NEXT")
    return HttpResponse("ERROR PASS")
  else:
    return render(request, "loginScreen.html")


def login_school(request):
  return HttpResponse("Not yet implemented... Check back soon!")


def logout_view(request):
  logout(request)
  return render(request, "successMessages/logout.html")

