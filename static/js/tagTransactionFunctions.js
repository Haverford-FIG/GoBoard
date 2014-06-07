
function getActiveTags(){
  var rawTags = $("#tagFilterInput").val();
  var tags = cleanTags(rawTags);
  return tags
}

function setActiveTags(tagArray){
  var tagString = "#" + tagArray.join(" #");
  $("#tagFilterInput").val(tagString);
}
