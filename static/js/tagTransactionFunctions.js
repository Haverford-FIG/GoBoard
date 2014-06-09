
function getActiveTags(){
  var rawTags = $("#tagFilterInput").val();
  var tags = cleanTags(rawTags);
  return tags
}

function setActiveTags(tagArray){
  //Add a(n) "#" before each element if needed.
  for (var i=0; i<tagArray.length; i++){
    if ("@#".indexOf(tagArray[i][0])<0){
      tagArray[i] = "#" + tagArray[i];
    }
  }

  var tagString = tagArray.join(" ");
  $("#tagFilterInput").val(tagString);
}
