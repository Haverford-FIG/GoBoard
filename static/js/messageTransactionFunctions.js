
function reloadMessages(messageContainer, tagArray, kwargs) {
  //If the container is locked, don't do anything.
  if ($(messageContainer).data("lockMessages")) return false;

  //Load any optional parameters, but default to no options set.
  if (kwargs===undefined) kwargs = {};

  //Sort the tags so different orders are made uniform.
  tagArray.sort();

  //Load any available messages from the cache.
  var tagString = tagArray.join(" ");
  if (kwargs["private"]==true) tagString += " PRIVATE";
  var currentMessages = messageCache[tagString];
  if (currentMessages===undefined) currentMessages = [];

  //Keep track of the current location
  var displayHeight = $(messageContainer).height();
  var oldContainerHeight = $(messageContainer).prop("scrollHeight");
  var currentScrollTop = $(messageContainer).scrollTop();
  var scrollWasAtBottom = (oldContainerHeight-displayHeight)==currentScrollTop


  //Lock the messageContainer from scroll-reloading new messages until
  //  the current batch of messages has been loaded and displayed.
  $(messageContainer).data("lockMessages",true);

  //Load the "most recent" (or "oldest") message ID for this tag set.
  var lastID = "None";
  if (currentMessages.length) {
    lastID = currentMessages[0]["pid"];
    if (kwargs["loadMore"]==true) {
      lastID = currentMessages[currentMessages.length-1]["pid"];
    }
  }

  //Load any messages before/after the lastID.
  //response = [message1, message2, ... ] or response = {error:"the error", ...}
  $.get('/get_messages/', {tags: tagArray,
                           private: (kwargs["private"]==true),
                           loadMore: kwargs["loadMore"]==true,
                           lastID: lastID,
                          }, function(response) {

    //Remove any current warnings that might be present.
    $(".messageContainerAlert").remove();

    //If the maxPage is reached, warn the user.
    var prependMessage = "";
    if (response["maxPage"]){
      if (currentMessages.length!=0) {
        prependMessage = buildMessageBoxAlert("No more messages!");
      }

    //Also warn if there was some other error.
    } else if (response["error"]){
      $(messageContainer).append(buildMessageBoxAlert(response["error"]));
      return false;
    } else {
      //Apply the newly-received messages to the message list (in the right order).
      if (kwargs["loadMore"]==true){
        currentMessages = currentMessages.concat(response);
      } else {
        currentMessages = response.concat(currentMessages);
      }
      messageCache[tagString] = currentMessages;
    }

    //Marks that no new .message elements should be added.
    var emptyUpdate = ((response.length===undefined || response.length===0) &&
           kwargs["messageCheck"]===true)

    //Apply the new messages if applicable.
    if (currentMessages.length==0){
      $(messageContainer).html(buildMessageBoxAlert("No messages found!"));
    } else if (! emptyUpdate) {
      setMessages(currentMessages, messageContainer);
    }

    //Prepend a warning/message if applicable.
    $(messageContainer).prepend(prependMessage);


    //Place the scrollbar back where it was.
    var newContainerHeight = $(messageContainer).prop("scrollHeight");
    var updatedScrollTop = newContainerHeight-oldContainerHeight+currentScrollTop;
    $(messageContainer).scrollTop(updatedScrollTop);


    //Scroll the container to see the latest (last) message.
    if (!kwargs["noScroll"] || scrollWasAtBottom){
      scrollBottom(messageContainer);
    }

    //After all changes are made, unlock the messageContainer.
    $(messageContainer).data("lockMessages",false);

    //Turn any link-like string sequences into links.
    if ((!emptyUpdate) && (!$(messageContainer).is(":empty"))) {
      applyMarkDown(messageContainer);
      $(messageContainer).linkify()
    }

  });

}

function scrollBottom(location){
  var bottomOfCell = $(location).prop("scrollHeight");
  $(location).animate({scrollTop: bottomOfCell}, "slow");
}

function setMessages(messages, container){
  //If specified, empty the message box before adding new messages.
  $(container).empty();

  //"display" each message (starting at the last message).
  for (var i=messages.length-1; i>= 0; i--){
    var message = messages[i];
    setMessage(message, container);
  }
}


function setMessage(message, container) {
  //Construct the message and display it.
  $(container).append( buildMessage(message) );
}
