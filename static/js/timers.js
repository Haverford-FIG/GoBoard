$(document).ready(function(){
//# # # # # # # # # # # # # # # # # # # # # # # # # # # 



//Start the #otherActiveUserCount timer.
function updateUserCounter(){
  $.get("/userCount/", function(response){
    var newHTML = buildUserCounter(parseInt(response));
    $("#otherActiveUserCount").html(newHTML);
  });
}
updateUserCounter()
setInterval(updateUserCounter, 15*1000);



//Load the most recently used tags into the #tagbox.
function reloadRecentTags(){
  $.get("/get_recent_tags/", function(tags) {
    $("#tagbox").html( buildRecentTags(tags) );
  });
}
reloadRecentTags();
setInterval(reloadRecentTags, 6*1000);


//# # # # # # # # # # # # # # # # # # # # # # # # # # # 
});
