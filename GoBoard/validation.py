from GoBoard.models import User
from datetime import datetime, timedelta

#Mostly taken from: http://stackoverflow.com/questions/4695609/checking-date-against-date-range-in-python .
def valid_grad_year(year):
  try:
    year = int(year)
  except:
    return False
  margin = 40
  this_year = datetime.now().year
  return this_year-margin <= year <= this_year+margin



def valid_username(username):
  result = True
  if not username or " " in username: 
    result = False
  if User.objects.filter(username=username).exists(): 
    result = False

  return result



def valid_email(email, should_exist=False):
  result = True
  if not email or " " in email or not "@" in email[1:-1]: 
    result = False

  if should_exist:
    if not User.objects.filter(email=email).exists(): 
      result = False
  else:
    if User.objects.filter(email=email).exists(): 
      result = False

  return result
