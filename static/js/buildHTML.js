
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

function buildTagMenu() {
  var HTML = "";
  HTML += "<div class='noSelect menu tagMenu'>";
  HTML +=   "<div class='menuOption'>";
  HTML +=     "Follow";
  HTML +=   "</div>";
  HTML += "</div>";
  return HTML;
}


function markTags(text, tags){
  var wordList = text.split(" ");

  for (var i=0 ; i < wordList.length ; i++) {
    var word = wordList[i];
    var preWordPunc = /^[\.,-\/!$%\^&\*;:{+\n\r\?\\<>\[\]'"}=\-_`~()]*/
    var postWordPunc = /[\.,-\/!$%\^&\*;:{+\n\r\?\\<>\[\]'"}=\-_`~()]*$/

    //Extract the punctuation from the beginning and ending of the word.
    var preWord = word.match(preWordPunc).join("");
    var postWord = word.match(postWordPunc).join("");

    //Remove the punctuation from the word to reveal the "cleaned" word.
    var clean = word.replace(preWordPunc,"");
    clean = clean.replace(postWordPunc,"");

    //And only mark tags/mentions that have been used in the text...
    if (clean[0]=="#" && tags.indexOf(clean)>=0){
      wordList[i] = preWord+"<span class='inlineTag activateTagMenu'>"+clean+
                    "</span>"+postWord;
    } else if (clean[0]=="@" && tags.indexOf(clean)>=0){
      wordList[i] = preWord+"<span class='inlineMention activateTagMenu'>"+clean+
                    "</span>"+postWord;
    }
  }

  return wordList.join(" ")
}


function buildMessage(msg){

  //Add the .privateMessage class if the message is private and the
  // .personalMessage class if the user is "mentioned" in it.
  var privateClass = (msg.is_private==true) ? "privateMessage": "";
  var personalClass = (msg.mentions.indexOf("@"+msg.user)>=0) ? "personalMessage ": "" ;

  text = markTags(msg.text, msg.tags.concat(msg.mentions) )

  var HTML = "<div data-did=\""+msg.pid+"\"";
  HTML += " class=\"message "+privateClass+personalClass+"\">";
  HTML += "<div class=\"messageText\">"+msg.text+"</div>";
  HTML += "<div class=\"userShadow\">"+msg.user+"</div>";
  HTML += "<div class=\"tagShadow\">"+buildTagArrayHTML(msg.tags, msg.mentions)
  HTML += "</div>";

  if (msg.deletable) {
    HTML += "<div title='Delete this post.' class='messageDeleteButton'></div>";
  }

  HTML += "</div>";
  return HTML;
}




