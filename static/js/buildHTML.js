
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

function buildTagMenu(tag) {
  var HTML = "";
  HTML += "<div class='noSelect menu tagMenu'>";
  HTML +=   "<div tag='"+tag+"' class='menuOption followTagButton'>";
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
  // Prepare the classes for this message.
  var privateClass = (msg.private==true) ? "privateMessage": "";
  var personalClass = (msg.mentions.indexOf("@"+msg.user)>=0) ? "personalMessage": "";
  var activeUser = $("#userGreeting").attr("username");
  var myMessageClass = (msg.user==activeUser) ? "myMessage": "" ;
  var noTagsClass = (msg.tags.length===0 && msg.mentions.length===0) ? "noTagsMessage": "" ;

  var text = markTags(msg.text, msg.tags.concat(msg.mentions) )
  var tags = buildTagArrayHTML(msg.tags, msg.mentions)

  var classes = [privateClass, personalClass, myMessageClass, noTagsClass]
  var HTML = "<div data-did=\""+msg.pid+"\"";
  HTML += " class=\"message "+classes.join(" ")+"\">";
  HTML += "<div class=\"messageText\">"+text+"</div>";
  HTML += "<div class=\"userShadow\">"+msg.user+"</div>";
  HTML += "<div class=\"tagShadow\">"+tags;
  HTML += "</div>";

  if (msg.deletable) {
    HTML += "<div title='Delete this post.' class='messageDeleteButton'></div>";
  }

  HTML += "</div>";
  return HTML;
}




