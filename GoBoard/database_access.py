from GoBoard.models import Message

def getMessages():
  return Message.objects.filter(enabled=True)
