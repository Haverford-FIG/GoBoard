
function reloadMessages(tagArray, kwargs) {

  //Variable Setup.
  if (kwargs===undefined) kwargs={page:1}; //Default to no "kwargs".
  var page = kwargs["page"]
  var messageContainer = ".messageBox";

  var displayHeight = $(messageContainer).height();
  var oldContainerHeight = $(messageContainer).prop("scrollHeight");
  var currentScrollTop = $(messageContainer).scrollTop();
  var scrollWasAtBottom = (oldContainerHeight-displayHeight)==currentScrollTop

  //Clear messages if specified.
  if (kwargs["clearMessages"]) clearMessages(messageContainer);

  //Lock the messageContainer from scroll-reloading new messages.
  $(messageContainer).data("lockMessages",true);

  $.get('/get_messages/', {tags: tagArray, page:page}, function(response) {
    //response = [message1, message2, ... ] or response = {error:"the error", ...}
    if (response["maxPage"]){
      $(messageContainer).data("maxPage",true);
      if ($(messageContainer).find(".message").length==0){
        $(messageContainer).html(buildMessageBoxAlert("No messages found!"));
      } else {
        $(messageContainer).prepend(buildMessageBoxAlert("No more messages!"));
      }
      return false;
    } else if (response["error"]){
      $(messageContainer).prepend(buildMessageBoxAlert(response["error"]));
      return false;
    }
    
    if (page == 1){
        $(messageContainer).data("page", 1);
        $(messageContainer).data("maxPage", false);
        displayMessages(response, "append", true);
    } else {
        $(messageContainer).data("page", page); //Update the current page.
        displayMessages(response, "prepend", false);
    }

    //Variable Setup.
    var newContainerHeight = $(messageContainer).prop("scrollHeight");

    //Place the scrollbar back where it was. 
    var updatedScrollTop = newContainerHeight-oldContainerHeight+currentScrollTop;
    $(messageContainer).scrollTop(updatedScrollTop);
    

    //Scroll the container to see the latest (last) message.
    if (!kwargs["noScroll"] || scrollWasAtBottom){
      scrollBottom(messageContainer);
    }
  
    //After all changes are made, unlock the messageContainer.
    $(messageContainer).data("lockMessages",false);

    //Turn any link-like sequences into links.
    $(messageContainer).linkify()

  });

}

function scrollBottom(location){
  var bottomOfCell = $(location).prop("scrollHeight");
  $(location).animate({scrollTop: bottomOfCell}, "slow");
}

function displayMessages(messages, prependOrAppend, emptyMessageBox){
  //If specified, empty the message box before adding new messages.
  empty = (emptyMessageBox===undefined) ? false : emptyMessageBox ;
  if (emptyMessageBox) $(".messageBox").empty();

  //"display" each message.
  for (var i=messages.length-1; i>= 0; i--){
    var message = messages[i];
    displayMessage(message, prependOrAppend);
  }
}

function displayMessage(message, prependOrAppend) {
  //Construct the message.  
  newMessage = buildMessage(message.text, message.user, message.tags);

  //And display it.
  if (prependOrAppend=="append") {
    $(".messageBox").append(newMessage);
  } else {
    $(".messageBox").prepend(newMessage);
  }
}

function clearMessages(location) {
  $(location).empty();
}
