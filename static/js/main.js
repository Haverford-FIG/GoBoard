$(document).ready(function() {
//###############################################################



//Start the #tagbox by loading the most recent tags if it exists.
if ($("#tagbox").length){
  setTagBox("recent");
}

//Start the userCount updater if there is an #OtherActiveUserCount container.
if ($("#otherActiveUserCount").length){
  updateUserCounter()
  setInterval(updateUserCounter, 15*1000);
}

//Start the messageReloader.
if ($(".messageBox").length){
  checkMessages();
  setInterval(checkMessages, 2*1000);
}

//Load the most recent "general" messages in the main chatbox.
reloadMessages(".messageBox", []);

loadAds();

//###############################################################
});
