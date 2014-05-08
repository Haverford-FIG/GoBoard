$(document).ready(function() {
//###############################################################

// Stores all the responses, so that they can appear as people need them

var response_full = [];

function displayMessages(messages){
	$(".messageBox").empty();

	for (var i=messages.length-1; i>= 0; i--){
		var message = messages[i];
		displayMessage(message, i);
	}

	console.log($(".messageBox")[0].scrollHeight);

	$(".messageBox").scrollTop($(".messageBox")[0].scrollHeight);
}

function displayMessage(message, i) {
	//Variable Setup.
	var text = message.text;
	var tags = message.tags;
	var user = message.user;
	var odd = i%2;
	
	var shout = "shoutOdd";
	if (odd == 0) {
	    shout = "shoutEven";
	}
	
	$(".messageBox").append(
		//"<div class=\"message\" class=\"" + shout + "\" tags=\""+tags+"\">"+text+"</div>"
		"<div class=\""+ shout + " message\" tags=\""+tags+"\">"+text+"</div>"
	);
}

function displayError(error) {
	$(".messageBox").append("<div class=\"error\">"+error+"</div>");
}

function reloadMessages(tagArray, page) {
	$.get('/get_messages/', {"tags": tagArray, "page":page}, function(response) {
		//response = [message1, message2, ... ]
		if (response["error"]){
			displayError(response["error"]);
		}
		
		var response_partial = response.slice(0,30);
		response_full = response;
		displayMessages(response_partial);
	});
}

function reloadRecentTags(){
  $.get("/get_recent_tags/", function(response) {
    $("#tagbox").html(response);
  });
}

function cleanTags(tagString){
	tagString = tagString.replace(/ /g, "");
	var tagArray = tagString.split("#")
	if (tagArray.length) tagArray.shift();

	return tagArray;
}

    $("#tagSearchSubmit").on("click", function() {
	var rawTags = $("#tagSearchBox").val();
	var tags = cleanTags(rawTags);
	reloadMessages(tags);
    });

    $("#messageSubmit").on("click", function() {
	var message = $("#message").val();
	var rawTags = $("#tags").val();
	var tagsRequired = false; //$("tagCheck").val(); //TODO: Add me!

	var tagArray = cleanTags(rawTags);
	
	var sendObj = {
			"tags": tagArray,
			"message": message,
			"tagCheck": tagsRequired
			};

	//Send the new message and get the most recent messages.
	$.post('/new_message/', sendObj, function(response){
		$("#message").val('');
		reloadMessages(tagArray, 1);
	});

	return false; //Don't continue or else the form will re-submit.
    });

  $.get("/get_tags/", function(response) {
    $( "#tags" ).autocomplete({
      source: response
    });
  });



	$('.kwicks').kwicks({
		maxSize: "30%",
        autoResize: true,
        spacing: 0,
		duration: 200,
        behavior: 'menu',
		interactive: false,	
      });	

reloadMessages([], 1);
reloadRecentTags();


//###############################################################
});	  
