//Display a message on the message box.
//Variable Axioms:
// message = "This is a sample message";
// tags = "#sample#message";

$(document).ready(function() {

function reloadMessages(messages, tags){
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

function reloadMessages(tags) {
	var json = {"tags": tags};
	$("tagCheck").val(tags);
	$.get('/get_messages/', json, function(response) {
		//response = [message1, message2, ... ]
		displayMessages(response);
	});
}

    $("#tagSearchSubmit").on("click", function() {
	tags = tags.replace(/ /g, "");
	reloadMessages(tags);
    });

    $("#messageForm").on("submit", function() {
	var tags = $("#tags").val();
	var message = $("#message").val();
	var tagsRequired = $("tagCheck").val();
	
	var sendObj = {};
	sendObj["tags"] = tags;
	sendObj["message"] = message;
	sendObj["tagCheck"] = tagsRequired;

	var json = JSON.stringify(sendObj);
	
	$.post('/new_message/', json);

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
 });	  

