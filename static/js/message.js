$(document).ready(function() {
//###############################################################

// Stores all the responses, so that they can appear as people need them
// the first index is the response, the second is the number already displayed
var response_full = [[], 0];

function displayMessages(messages){
	$(".messageBox").empty();

	for (var i=messages.length-1; i>= 0; i--){
		var message = messages[i];
		displayMessage(message, i);
	}


	$(".messageBox").scrollTop($(".messageBox")[0].scrollHeight);
}

function addMessages(messages){
	for (var i=messages.length-1; i>= 0; i--){
		var message = messages[i];
		addMessage(message, i);
	}
}

function addMessage(message, i) {
	//Variable Setup.
	var text = message.text;
	var tags = message.tags;
	var user = message.user;
	var odd = i%2;
	
	var shout = "shoutOdd";
	if (odd == 0) {
	    shout = "shoutEven";
	}
	
	$(".messageBox").prepend(
		//"<div class=\"message\" class=\"" + shout + "\" tags=\""+tags+"\">"+text+"</div>"
		"<div class=\""+ shout + " message\" tags=\""+tags+"\">"+text+"</div>"
	);
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
		if (page != 1){
		    addMessages(response);
		}
		else{
		    displayMessages(response);
		}
	});
}

function cleanTags(tagString){
	tagString = tagString.replace(/ /g, "");
	var tagArray = tagString.split("#")
	if (tagArray.length) tagArray.shift();

	return tagArray;
}

var scrollCounter = 2;

    $(".messageBox").on('scroll', function() {
	var scrollTop = $(this).scrollTop();
	var top_distance = $(this).offset().top;

	if (scrollTop == 0) {
	    reloadMessages("",scrollCounter);
	    scrollCounter++;
	}
    });
    
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
