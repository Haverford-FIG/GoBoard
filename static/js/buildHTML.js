
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

