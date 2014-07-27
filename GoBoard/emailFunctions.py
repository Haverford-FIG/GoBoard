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


def email_weekly_consensus():
  from django.template import Template, Context
  from GoBoard.models import User
  from GoBoard.views.events import getApprovedEvents, categorizeEvents

  events = getApprovedEvents().filter(weeklyConsensus=True)
  with open("templates/emails/weeklyConsensus.html") as f:
    template = Template(f.read())
    categorizedEvents = categorizeEvents(events)
    context = Context({"categorizedEvents":categorizedEvents})
    message = template.render(context)

  #Email those users that have chosen to receive Weekly Consensus updates.
  users = User.objects.filter(userinfo__email_about_weekly_consensus=True)
  for user in users:
    email_user(user, "Weekly Consensus", message)

  #Allow the message to be collected.
  return message

