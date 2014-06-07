
function getActiveTags(){
  var rawTags = $("#tagFilterInput").val();
  var tags = cleanTags(rawTags);
  return tags
}
