from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse
from django.shortcuts import render

def login_view(request):
  u = authenticate(username = request["POST"].username, 
                   password = request["POST"].password)
  if u is not None:
    if u.is_active:
      login(request, user)
  return HttpResponse("Failure")

def logout_view(request):
  logout(request)  
  return render(request, "successMessages/logout.html")

