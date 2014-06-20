
function buildMessageBoxAlert(message){
  var HTML = "";
  HTML += "<div class=\"messageContainerAlert\">"+message+"</div>"
  return HTML;
}


//Return the HTML for a list of .updateTag elements.
function buildUpdateTags(tagArray){
  var HTML = "";
  for (var i=0; i<tagArray.length; i++){
    HTML += "<div class=\"updateTag tagLink\">"+tagArray[i]+"</div>"
  }
  return HTML;
}



//Return the HTML for a list of Tags wrapper in a .tagGroup class.
function buildTagArrayHTML(tagArray, mentionArray) {
  var HTML = "<div class=\"tagGroup\">";
  for (var i=0; i < tagArray.length ;i++){
    HTML += buildTagHTML(tagArray[i]);
  }
  for (var i=0; i < mentionArray.length ;i++){
    HTML += buildMentionHTML(mentionArray[i]);
  }
  HTML += "</div>";
  return HTML;
}

//Return the HTML for a single .tag DOM element.
function buildTagHTML(tag){
  return "<span class=\"tag tagLink\">"+tag+"</span>";
}


//Return the HTML for a single .tag DOM element.
function buildMentionHTML(username){
  return "<span class=\"mention tagLink\">"+username+"</span>";
}


function buildUserCounter(userCount){
  var HTML = "";
  if (userCount>1){
    HTML += String(userCount-1)+" others online!";
  } else {
    HTML += "No other users online. :(";
  }
  return HTML;
}

function buildMessage(text, user, tagArray, mentionArray, is_private){
  //Add the .privateMessage class if the message is private and the
  // .personalMessage class if the user is "mentioned" in it.
  var privateClass = (is_private==true) ? "privateMessage": "";
  var personalClass = (mentionArray.indexOf("@"+user)>=0) ? "personalMessage ": "" ;

  var HTML = "<div class=\"message "+privateClass+personalClass+"\">";
  HTML += "<div class=\"messageText\">"+text+"</div>";
  HTML += "<div class=\"userShadow\">"+user+"</div>";
  HTML += "<div class=\"tagShadow\">"+buildTagArrayHTML(tagArray, mentionArray)
  HTML += "</div></div>";
  return HTML;
}




