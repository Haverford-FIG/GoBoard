from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse
from django.shortcuts import render

def login_view(request):
  if request.method=="POST":
    try:
      u = authenticate(username = request.POST["username"], 
                       password = request.POST["password"])
      if u is not None:
        if u.is_active:
          login(request, u)
        return HttpResponse("NEXT")
    except Exception as e:
      print e
      pass
    return HttpResponse("ERROR")
  else:
    return render(request, "loginScreen.html")
    

def logout_view(request):
  logout(request)  
  return render(request, "successMessages/logout.html")

