from models import Message, Tag
import datetime

def tag_exists(tag):
 return Tag.objects.filter(tag=tag).exists()

def store_message(text, tagList, user, tags_required):
  #Construct the message itself.
  message = Message()
  message.user = user
  message.text = text
  message.tags_required = tags_required
  message.save()

  #Store each tag.
  for tag in tagList:
    if tag_exists(tag):
      add_message_to_tag(tag, message)
    else:
      store_tag(tag, message)

  message.save()

  return message

def add_message_to_tag(tag_string, new_message):
  try:
    tag = Tag.objects.filter(tag=tag_string).get()
    tag.message.add(new_message)
    tag.save()
  except Exception as e:
    print "ERROR ADDING MESSAGE TO TAG: {}".format(e)

def store_tag(text, message):
  try:
    #Construct the tag.
    tag = Tag()
    tag.tag = text
    tag.save()

    #Actually apply the message to the tag.
    add_message_to_tag(text, message)
    return tag
  except Exception as e:
    print "ERROR CONSTRUCTING TAG: {}".format(e)

