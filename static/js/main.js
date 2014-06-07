$(document).ready(function() {
//###############################################################

// Stores all the responses, so that they can appear as people need them
// the first index is the response, the second is the number already displayed
var response_full = [[], 0];



$('.kwicks').kwicks({
	maxSize: "30%",
autoResize: true,
spacing: 0,
	duration: 200,
behavior: 'menu',
	interactive: false,	
});	



reloadMessages([], 1);


//###############################################################
});	 
