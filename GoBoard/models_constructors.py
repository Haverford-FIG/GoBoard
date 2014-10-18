from models import Message, Tag, User
import datetime

def tag_exists(tag):
  return Tag.objects.filter(tag=tag).exists()


def user_exists(username):
  return User.objects.filter(username=username).exists()

def connect_tag(tag, message=None, event=None):
  #Remove the prefix.
  prefix = tag[0]
  tag = tag[1:]

  if prefix=="#":
    if not tag_exists(tag):
      tag = newTag(tag)
    if message:
      add_tag_to_message(tag, message)
    if event:
      add_tag_to_event(tag, event)
  elif prefix=="@":
    if user_exists(tag) and message:
      add_user_to_message(tag, message);
  else:
    error = "Tag '{}' has inapproriate prefix. Choices are '@' or '#'.".format(tag)
    raise Exception(error)


def store_message(text, tagList, user, tags_required, private):
  #Construct the message itself.
  message = Message()
  message.user = user
  message.text = text
  message.tags_required = tags_required
  message.private = private
  message.save()

  #Store each tag.
  for tag in tagList:
    connect_tag(tag, message=message)

  message.save()
  return message


def add_user_to_message(username, new_message):
  try:
    user = User.objects.filter(username=username).get()
    user.mentions.add(new_message)
    user.save()

    #Email the user if they chose to be emailed on mentions.
    if user.email_about_mentions:
      text = "You've been mentioned:\n\n\"{}\"".format(new_message.text)
      email_user(user, "Go! -- Mentioned in Message", text)
  except Exception as e:
    print "ERROR ADDING MESSAGE TO TAG: {}".format(e)


def add_tag_to_message(tag, new_message):
  from GoBoard.models import Tag
  try:
    if type(tag)!=Tag:
      tag = Tag.objects.filter(tag=tag).get()
    tag.message.add(new_message)
    tag.save()
    return tag
  except Exception as e:
    print "ERROR ADDING MESSAGE TO TAG: {}".format(e)

def add_tag_to_event(tag, event):
  from GoBoard.models import Tag
  try:
    if type(tag)!=Tag:
      tag = Tag.objects.filter(tag=tag).get()
    tag.event.add(event)
    tag.save()
    return tag
  except Exception as e:
    print "ERROR ADDING EVENT TO TAG: {}".format(e)



def newTag(text):
  try:
    #Construct the tag.
    tag = Tag()
    tag.tag = text
    tag.save()
    return tag
  except Exception as e:
    print "ERROR CONSTRUCTING TAG: {}".format(e)

