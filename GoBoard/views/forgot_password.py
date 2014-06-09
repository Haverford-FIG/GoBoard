from django.http import HttpResponse
from django.shortcuts import render
from GoBoard.models import User
from GoBoard.emailFunctions import email_user
from GoBoard.validation import valid_username, valid_email
from GoBoard.emailMessageContent import getChangePasswordText
import string
import random

def changeUserPassword(user, password):
  user.set_password(password)
  email_user(user, "Password Change", getChangePasswordText(user, password))
  user.save()


def get_random_code(length = 20):
 return "".join(
   random.choice(
    string.letters + string.digits
   ) for i in range(length))


def randomizePassword(u):
  newPass = get_random_code()
  changeUserPassword(u, newPass) 


def forgot_password(request):
  if request.method=="POST":
    email = request.POST.get("email")
    if valid_email(email, should_exist=True):
      u = User.objects.filter(email=email).first()
      randomizePassword(u)
      return HttpResponse("SUCCESS") #TODO: Should give an "emailed ya!" message.

    return HttpResponse("ERROR EMAIL")
  else:
    return render(request, "forgotPasswordScreen.html")


