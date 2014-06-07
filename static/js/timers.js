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


//# # # # # # # # # # # # # # # # # # # # # # # # # # # 
});
