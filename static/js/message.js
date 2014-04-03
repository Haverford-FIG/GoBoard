$(document).ready(function() {
    $("#submit").on("click", function() {
	var tags = $("#tags").val();
	var message = $("#message").val();
	var tagsRequired = $("tagCheck").val();
	
	var sendObj = {};
	sendObj["tags"] = tags;
	sendObj["message"] = message;
	sendObj["tagCheck"] = tagsRequired;

	var json = JSON.stringify(sendObj);
	
	$.post('/new_messages/', json);
    });
});
