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


$(document).on("click", ".customCheckbox", function(){
  $(this).toggleClass("active");
  if ($(this).attr("autoReload")==="true"){
    $("#tagFilterSubmit").trigger("click");
  }
});

//Submit a form when a user clicks the #submitFormButton only if it is valid.
$(document).on("click", "#formSubmitButton", function(){
  var form = $(this).closest("form");
  var url = $(form).attr("action");

  //Validates the form contents and converts [{name:val},{name2:val2}, ...]
  //  to a more dictionary-like form: {name:val, name2:val2,...}
  //validateForm also sets .badInputs to allow for easy checking.
  var formContents = validateForm(form, url);
  if ($(form).find(".badInput").length) return false;

  $.post(url, formContents, function(response){
    if (response=="SUCCESS"){
      window.location.reload();
    } else if (response.substr(0,5)=="ERROR"){
      var error = response.split(" ")[1];
      var badElements="";
      if (error===undefined || error=="PASS"){
        badElements = "input[name=password],input[name=currentPass]";
      } else if (error=="USERNAME"){
        badElements = "input[name=username]";
      } else if (error=="EMAIL"){
        badElements = "input[name=email]";
      } else if (error=="GRAD"){
        badElements = "input[name=grad_year]";
      } else {
        throw "oops... Don't know what to do with ERROR: '"+error+"'.";
      }

      applyErrorClass($(form).find(badElements),false);
    } else if (response=="NEXT"){
      //If there is a "next" page specified, load it.
      var next = getURLParams("next");
      if (next===undefined) next = "/home/";
      window.location.href = next;
    } else {
      //TODO: Make me a pretty error message.
      alert("OOPS!! We don't know what to do with that result...")
    }
  });
});

//Update the .badInput for forms after a user inputs new info.
$(document).on("blur", ".fullScreenForm input", function() {
  var form = $(this).closest("form");
  var url = $(form).attr("action");
  formContents = validateForm(form, url);
});



//If the user presses enter in the #newMessageInput, send the message.
var tagsAdded = "";
$(document).on("keydown", "#newMessageInput", function(e) {
  if (e.which==13) {
    $("#newMessageSubmit").trigger("click");
    return false;
  }

  var c = String.fromCharCode(e.which) 
  var rawInput = $(this).val() + c;

  //Grab everything except a currently-being-written hash.
  var cleanInput = rawInput.replace(/(#|@)[^ #@]+$/,"");
  if (cleanInput!=""){
    var messageTags = cleanTags(cleanInput);
    var oldTags = getActiveTags();
    var inputTags = getActiveTags("#newTagsInput");
    var uniqueTags = removeDuplicateTags(messageTags.concat(oldTags)
                                                    .concat(inputTags))
    setActiveTags(uniqueTags, "#newTagsInput");
  };

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
  var private = $(this).siblings(".customCheckbox[name=private]")
                          .hasClass("active");
  setActiveTags(tags); //Show the "clean" tags that are actually being used.
  reloadMessages(tags, {clearMessages:true, page:1, private:private});
});

$(document).on("click", ".tagLink", function() {
  var tag = cleanTags($(this).html());
  setActiveTags(tag);
  $("#tagFilterSubmit").trigger("click");
});

$(document).on("click", "#newMessageSubmit", function() {
  if ($("#userGreeting").length==0){
    alert("Oops. Yain't logged in.");//TODO: Make me pretttyyyy...
    return false;
  }

  var message = $("#newMessageInput").val();
  var rawTags = $("#newTagsInput").val();
  var tagsRequired = false; //$("#tagsRequiredInput").val(); //TODO: Add me!
  var private = $(this).siblings(".customCheckbox[name=private]")
                          .hasClass("active");

  //Validate the message and collect the cleaned tagArray.
  var tagArray;
  try {
    validateMessage(message);
    tagArray = cleanTags(rawTags);
  } catch(err){
    applyErrorClass("#newMessageInput");
    return false;
  }
  
  //Construct an object to describe this message for the server.
  var sendObj = {
  		"tags": tagArray,
  		"message": message,
  		"tagCheck": tagsRequired,
  		"private": private,
  }
  
  //Send the new message and get the most recent messages.
  $.post('/new_message/', sendObj, function(response){
    applyTempGoodClass("#newMessageInput");
    $("#newMessageInput").val('');
    reloadMessages(tagArray, {page:1, private:private});
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
  $.get("/get_usernames/", function(userList) {
    var validList = userList.concat(tagList);
    $( ".tagAutoComplete" ).autocomplete({
      source: function(request, response) {
                  response($.ui.autocomplete.filter(
                  validList, extractLast(request.term)));
              },
      minLength:0,
      focus: function(){return false},
      select: function(event, ui){
                var terms = split(this.value);
                terms.pop();
                terms.push(ui.item.value);
                terms.push("");
                var dirty = terms.join(" ");
                var cleaned = dirty.match(/(#|@)[a-zA-Z]+/gm).join(" ");
                this.value = cleaned;
                return false;
              }
    });
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
