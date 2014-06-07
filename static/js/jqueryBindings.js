$(document).on("ready", function() {
//# # # # # # # # # # # # # # # # # # # # # # # # # # # #


//If the user presses enter in the #newMessageInput, send the message.
$(document).on("keydown", "#newMessageInput", function(e) {
  if (e.which==13) {
    $("#newMessageSubmit").trigger("click");
    return false;
  }
});




var scrollCounter = 2;
    $(document).on("scroll", ".messageBox", function() {
	var scrollTop = $(this).scrollTop();
	var top_distance = $(this).offset().top;

	if (scrollTop == 0) {
	    reloadMessages("", scrollCounter);
	    scrollCounter++;
	}
    });
    
    $(document).on("click", "#tagFilterSubmit", function() {
	var rawTags = $("#tagFilterInput").val();
	var tags = cleanTags(rawTags);
	reloadMessages(tags);
    });


    $(document).on("click", "#newMessageSubmit", function() {
	var message = $("#newMessageInput").val();
	var rawTags = $("#newTagsInput").val();
	var tagsRequired = false; //$("tagCheck").val(); //TODO: Add me!

	var tagArray = cleanTags(rawTags);
	
	var sendObj = {
			"tags": tagArray,
			"message": message,
			"tagCheck": tagsRequired
			};

	//searching for empty messages
	if (message == "") {
		$("#newMessageInput").addClass('badInput');
		setTimeout(function() {
			$("#newMessageInput").removeClass('badInput', 300);
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
				$("#newMessageInput").css('background-color', 'white');
			}, 5000);
			return false;
		}
	}
	//Send the new message and get the most recent messages.
	$.post('/new_message/', sendObj, function(response){
		$("#newMessageInput").val('');
		reloadMessages(tagArray, 1);
	});

	return false; //Don't continue or else the form will re-submit.
    });


//# # # # # # # # # # # # # # # # # # # # # 
//jQuery Autocomplete for Tag Inputs # # # # 
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


//# # # # # # # # # # # # # # # # # # # # # # # # # # # #
});
