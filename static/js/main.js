$(document).ready(function() {
//###############################################################


$('.kwicks').kwicks({
	maxSize: "30%",
autoResize: true,
spacing: 0,
	duration: 200,
behavior: 'menu',
	interactive: false,	
});	

//Start the #tagbox by loading the most recent tags.
setTagBox("recent");

//Start the userCount updater as well.
updateUserCounter()
setInterval(updateUserCounter, 15*1000);

//Load the most recent "general" messages in the main chatbox.
reloadMessages([]);


//###############################################################
});	 