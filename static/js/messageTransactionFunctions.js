
function reloadMessages(tagArray, page) {
  $.get('/get_messages/', {"tags": tagArray, "page":page}, function(response) {
    //response = [message1, message2, ... ]
    if (response["error"]){
      displayError(response["error"]);
    }
    
    if (page != 1){
        displayMessages(response, "prepend", false);
    } else {
        displayMessages(response, "append", true);
    }
  });

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

  //If we are at the bottom of the messages.
  if (prependOrAppend=="append"){ 
    $(".messageBox").scrollTop($(".messageBox")[0].scrollHeight);
  }
}

function displayMessage(message, prependOrAppend) {
  //Variable Setup.
  var text = message.text;
  var user = message.user;
  var tagArray = message.tags;

  //Construct the message itself.  
  var newMessage = "<div class=\"message\">";
  newMessage += "<div class=\"messageText\">"+text+"</div>";
  newMessage += "<div class=\"userShadow\">"+user+"</div>";
  newMessage += "<div class=\"tagShadow\">"+buildTagArrayHTML(tagArray)+"</div>";
  newMessage += "</div>";

  if (prependOrAppend=="append") {
    $(".messageBox").append(newMessage);
  } else {
    $(".messageBox").prepend(newMessage);
  }
}

function displayError(error) {
	$(".messageBox").append("<div class=\"error\">"+error+"</div>");
}
