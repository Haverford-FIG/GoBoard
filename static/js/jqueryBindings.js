$(document).on("ready", function() {
//# # # # # # # # # # # # # # # # # # # # # # # # # # # #

//If the user clicks an .updateContainerOption, set the timer
//  to reset with the chosen option.
$(document).on("click", ".updateContainerOption", function(e) {
  //Get the "adjective item" to update (eg: "recent tags").
  var choiceTuple = $(this).attr("value").split(" ");
  var adjective = choiceTuple[0];
  var item = choiceTuple[1];

  if (item=="tags"){
    setTagBox(adjective); 
  } else if (item=="messages") {
    throw "message updates not set yet!!!!";
  } else {
    throw "Uh oh. .updateContainerOption not set for '"+choiceTuple+"'";
  }

});



//If the user presses enter in the #newMessageInput, send the message.
$(document).on("keydown", "#newMessageInput", function(e) {
  if (e.which==13) {
    $("#newMessageSubmit").trigger("click");
    return false;
  }
});

//TODO: Fix this on the newMessage Submit....
//Also allow tag-filters to submit by pressing enter.
$(document).on("keydown", ".tagAutoComplete", function(e) {
  if (e.which==13) {
    $(this).siblings(".submitButton").trigger("click");
    return false;
  }
});


$(".messageBox").scroll(function() {
  var scrollTop = $(this).scrollTop();
  var containerNotEmpty = $(this).find(".message").length != 0;
  var containerNotLocked = $(this).data("lockMessages")==false;
  var containerMaxed = $(this).data("maxPage");
  if (containerMaxed===undefined) containerMaxed=false;

  var page = $(this).data("page");
  if (page===undefined) page=1;

  if (scrollTop==0 && containerNotEmpty && 
      containerMaxed==false && containerNotLocked) {
    page++;
    var tags = getActiveTags();
    reloadMessages(tags, {page:page, noScroll:true});
  }
});


    
$(document).on("click", "#tagFilterSubmit", function() {
  var tags = getActiveTags();
  reloadMessages(tags, {clearMessages:true, page:1});
});

$(document).on("click", ".tagLink", function() {
  var tag = cleanTags($(this).html());
  setActiveTags(tag);
  $("#tagFilterSubmit").trigger("click");
});

$(document).on("click", "#newMessageSubmit", function() {
  var message = $("#newMessageInput").val();
  var rawTags = $("#newTagsInput").val();
  var tagsRequired = false; //$("#tagsRequiredInput").val(); //TODO: Add me!
  var privateMsg = false; //$("#privateMessageInput").val(); //TODO: Add me!

  //Validate the message and collect the cleaned tagArray.
  var tagArray;
  try {
    validateMessage(message);
    tagArray = cleanTags(rawTags);
  } catch(err){
    applyTempErrorClass("#newMessageInput");
    return false;
  }
  
  //Construct an object to describe this message for the server.
  var sendObj = {
  		"tags": tagArray,
  		"message": message,
  		"tagCheck": tagsRequired,
  		"private": privateMsg,
  }
  
  //Send the new message and get the most recent messages.
  $.post('/new_message/', sendObj, function(response){
    applyTempGoodClass("#newMessageInput");
    $("#newMessageInput").val('');
    reloadMessages(tagArray, {page:1});
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

//# # # # # # # # # # # # # # # # # # # # # 
//jQuery Autocomplete for Options Menu # # #
$("#optionMenuButton").click(function() {
  var menu = $("#optionMenu");
  if ($(menu).is(":visible")) {
    $(menu).hide();
  } else {
    $(menu).show();
  }
});


//# # # # # # # # # # # # # # # # # # # # # # # # # # # #
});
