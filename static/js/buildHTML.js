
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
function buildTagArrayHTML(tagArray) {
  var HTML = "<div class=\"tagGroup\">";
  for (var i=0; i < tagArray.length ;i++){
    HTML += buildTagHTML(tagArray[i]);
  }
  HTML += "</div>";
  return HTML;
}

//Return the HTML for a single .tag DOM element.
function buildTagHTML(tag){
  return "<span class=\"tag tagLink\">"+tag+"</span>";
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


