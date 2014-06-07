$(document).ready(function() {
//###############################################################

// Stores all the responses, so that they can appear as people need them
// the first index is the response, the second is the number already displayed
var response_full = [[], 0];

function displayMessages(messages, prependOrAppend, emptyMessageBox){
  //If specified, empty the message box before adding new messages.
  empty = (emptyMessageBox===undefined) ? false : emptyMessageBox ;
  if (emptyMessageBox) $(".messageBox").empty();

  //"display" each message.
  for (var i=messages.length-1; i>= 0; i--){
    var message = messages[i];
    displayMessage(message, prependOrAppend);
  }

  //If we are at the bottom of the messages.
  if (prependOrAppend=="append"){ 
    $(".messageBox").scrollTop($(".messageBox")[0].scrollHeight);
  }
}

function displayMessage(message, prependOrAppend) {
  //Variable Setup.
  var text = message.text;
  var user = message.user;
  var tagArray = message.tags;

  //Construct the message itself.  
  var newMessage = "<div class=\"message\">";
  newMessage += "<div class=\"messageText\">"+text+"</div>";
  newMessage += "<div class=\"userShadow\">"+user+"</div>";
  newMessage += "<div class=\"tagShadow\">"+buildTagArrayHTML(tagArray)+"</div>";
  newMessage += "</div>";

  if (prependOrAppend=="append") {
    $(".messageBox").append(newMessage);
  } else {
    $(".messageBox").prepend(newMessage);
  }
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
        displayMessages(response, "prepend", false);
    } else {
        displayMessages(response, "append", true);
    }
  });
}

function reloadRecentTags(){
  $.get("/get_recent_tags/", function(tags) {
    var newTags = "";
    for (var i=0; i<tags.length; i++){
      newTags += "<div class=\"recentTag tagLink\">"+tags[i]+"</div>"
    }
    $("#tagbox").html(newTags);
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
	    reloadMessages("", scrollCounter);
	    scrollCounter++;
	}
    });
    
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

	//searching for empty messages
	if (message == "") {
		$("#message").addClass('badInput');
		setTimeout(function() {
			$("#message").removeClass('badInput', 300);
		}, 1000);
		return false;
	}
	
	// looking for innappropriate(sp?) tags
	for (var i = 0; i<tagArray.length; i++) {
		patt = new RegExp(/[^a-zA-z0-9]/);
		if (patt.test(tagArray[i])) {
			$("#tags").css('background-color', 'red');
			$("#tags").attr('placeholder', "Please only letters and numbers in tag");	
			setTimeout(function() {
				$("#message").css('background-color', 'white');
			}, 5000);
			return false;
		}
	}
	//Send the new message and get the most recent messages.
	$.post('/new_message/', sendObj, function(response){
		$("#message").val('');
		reloadMessages(tagArray, 1);
	});

	return false; //Don't continue or else the form will re-submit.
    });

    function split( val ) {
      return val.split( /\s+/ );
    }
    function extractLast( term ) {
      return split( term ).pop();
    }

  $.get("/get_tags/", function(tagList) {
    $( ".tagAutoComplete" ).autocomplete({
      source: function(request, response) {
                  response($.ui.autocomplete.filter(
                  tagList, extractLast(request.term)));
              },
      minLength:0,
      focus: function(){return false},
      select: function(event, ui){
                var terms = split(this.value);
                terms.pop();
                terms.push(ui.item.value);
                terms.push("");
                var dirty = terms.join(" ");
                var cleaned = dirty.match(/#[a-zA-Z]+/gm).join(" ");
                this.value = cleaned;
                return false;
              }
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
