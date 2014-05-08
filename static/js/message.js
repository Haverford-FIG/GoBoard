$(document).ready(function() {
//###############################################################

function displayMessages(messages){
	$(".messageBox").empty();

	for (var i=0; i < messages.length ; i++){
		var message = messages[i];
		displayMessage(message);
	}
}

function displayMessage(message) {
	//Variable Setup.
	var text = message.text;
	var tags = message.tags;
	var user = message.user;

	$(".messageBox").append(
		"<div class=\"message\" tags=\""+tags+"\">"+text+"</div>"
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
		displayMessages(response);
	});
}

function cleanTags(tagString){
	tagString = tagString.replace(/ /g, "");
	var tagArray = tagString.split("#")
	if (tagArray.length) tagArray.shift();

	return tagArray;
}

    $("#tagSearchSubmit").on("click", function() {
	var rawTags = $("#tags").val();
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

  $.get("/get_tags", function(response) {
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



//###############################################################
});	  
