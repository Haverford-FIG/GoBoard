from models import Message, Tag, User
import datetime

def tag_exists(tag):
 return Tag.objects.filter(tag=tag).exists()

def user_exists(username):
 return User.objects.filter(username=username).exists()


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
    #Remove the prefix.
    prefix = tag[0]
    tag = tag[1:]

    if prefix=="#":
      if tag_exists(tag):
        add_tag_to_message(tag, message)
      else:
        store_tag(tag, message)
    elif prefix=="@":
      if user_exists(tag):
        add_user_to_message(tag, message);
    else:
      raise Exception("Tag has inapproriate prefix. Choices are '@' or '#'.")

  message.save()
  return message


def add_user_to_message(username, new_message):
  try:
    user = User.objects.filter(username=username).get()
    user.mentions.add(new_message)
    user.save()
  except Exception as e:
    print "ERROR ADDING MESSAGE TO TAG: {}".format(e)



def add_tag_to_message(tag_string, new_message):
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
    add_tag_to_message(text, message)
    return tag
  except Exception as e:
    print "ERROR CONSTRUCTING TAG: {}".format(e)

