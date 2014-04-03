from models import Message, Tag

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
  for new_tag in tagList:
    if tag_exists(new_tag):
      new_tag.message.add(message)
    else:
      store_tag(new_tag, message)

  return message


def store_tag(text, message):
  #Construct the tag.
  tag = Tag()
  tag.tag = text
  tag.message = message
  tag.save()

  return tag

