import sys
from django.core.mail import send_mail
from GoBoard.settings import DEBUG, EMAIL_HOST_USER

"""
Note that in DEBUG-mode (indicated in settings.py) email errors will not
be logged -- since emailing should never work if you have the password
correctly set to "SecurePassword" as you should while developing.
"""

######################  Email Functions  ###########################

def email_user(user, subject, message):
  try:
    send_mail("Go: {}".format(subject), message, EMAIL_HOST_USER,
              [user.email], fail_silently=False)
  except:
    if not DEBUG:
      print("email_user failed: {}\n".format(user.id))


