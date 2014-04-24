//Display a message on the message box.
//Variable Axioms:
// message = "This is a sample message";
// tags = "#sample#message";

$(document).ready(function() {

function displayMessages(messages, tags){
	$(".messageBox").empty();
	for (var i=0; i < messages.length ; i++){
		displayMessage(messages[i], tags);
	}
}

function displayMessage(message, tags) {
	$(".messageBox").append(
		"<div class=\"message\" tags=\""+tags+"\">"+message+"</div>"
	);
}

function displayError(error) {
	$(".messageBox").append("<div class=\"error\">"+error+"</div>");
	console.log(error);
}

function reloadMessages(tags) {
	var json = {"tags": tags};
	$("tagCheck").val(tags);
	displayMessages([{"message":"hello", "tags":"yolo"},{"message":"first", "tags":"welcome"}]);
	$.get('/get_messages/', json, function(response) {
		//response = [message1, message2, ... ]
		if (response["error"]){
			displayError(response["error"]);
		}
		displayMessages(response);
	});
}

    $("#tagSearchSubmit").on("click", function() {
	tags = tags.replace(/ /g, "");
	reloadMessages(tags);
    });

    $("#messageSubmit").on("click", function() {
	var tags = $("#tags").val();
	var message = $("#message").val();
	//var tagsRequired = $("tagCheck").val();
	var tagsRequired = false;//TODO: Add me!!!
	
	var sendObj = {};
	sendObj["tags"] = tags;
	sendObj["message"] = message;
	sendObj["tagCheck"] = tagsRequired;

	$.post('/new_message/', sendObj);
	var json = JSON.stringify(sendObj);
	
	$.post('/new_message/', json);
	
	$("#tags").val('');
	$("#message").val('');
	$("#tagCheck").val('');
	
	console.log($("#message").val())

	reloadMessages(tags);
	return false; //Don't continue or else the form will re-submit.
    });



    var availableTags = [
      "Haverfest",
      "CSMajors"
    ];
    $( "#tags" ).autocomplete({
      source: availableTags
    });
     $('#messagebox').animate({ 
	   scrollTop: $("#messagebox").prop("scrollHeight")}, 0
	);

	$('.kwicks').kwicks({
		maxSize: "30%",
        autoResize: true,
        spacing: 0,
		duration: 200,
        behavior: 'menu',
		interactive: false,	
    });	
 });	  

