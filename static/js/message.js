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
    
	$("#tags").val("");
	$("#message").val("");
    });
});

$(document).on("ready",function() {
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

