
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


function buildTime(timestring) {
  function getTime(timestring) {
    var hour = raw.getHours();
    var par = "AM";
    if (hour>=12) {
      hour -= 12;
      par = "PM"
    }
    if (hour==0) {
      hour += 12;
    }

    var time = hour+":"+raw.getMinutes()+par;
    return time;
  }

  var now = new Date();
  var raw = new Date(timestring);
  var result = "";

  if ((now-raw)>1000*60*60*24) { //Older than a day.
    var date = raw.getMonth()+"/"+raw.getDate()+"/"+raw.getFullYear();
    result += date +" at "+ getTime(raw);

  } else if ((now-raw)>1000*60*60) { //Older than an hour.
    result += "Today at " + getTime(raw);
  } else if ((now-raw)>1000*60*7) { //Older than 7 minutes.
    var time = parseInt((now-raw)/(1000*60));
    result += time + " minutes ago";
  } else if ((now-raw)>1000*60*3) { //Older than 3 minutes.
    result += "A few minutes ago";
  }

  return result;
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
  HTML += "<div class=\"tagShadow\">"+tags+"</div>";
  HTML += "<div class=\"timeShadow\">"+buildTime(msg.datetime)+"</div>";

  if (msg.tags.length>0) {
    HTML += "<div class=\"messageReplyButton\" title='Reply'>";
    HTML += "<img class=\"messageButton\" src=\"static/icons/reply.png\"/>";
    HTML += "</div>";
  }

  if (msg.deletable) {
    HTML += "<div title='Delete this post.' class='messageDeleteButton'></div>";
  }

  HTML += "</div>";
  return HTML;
}




