from GoBoard.models import User

def valid_username(username):
  result = True
  if not username or " " in username: 
    result = False
  if User.objects.filter(username=username).exists(): 
    result = False

  return result

def valid_email(email):
  result = True
  if not username or " " in username or not "@" in username[1:-1]: 
    result = False
  if User.objects.filter(email=email).exists(): 
    result = False

  return result
