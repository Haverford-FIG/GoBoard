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

  var shouldBeActive = $(this).hasClass("active");
  if ($(this).attr("id")=="tagFilterPrivate"){
    console.log(shouldBeActive);
    $("#newMessagePrivate").toggleClass("active", shouldBeActive);
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
    e.preventDefault();
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


$(document).on("keydown", "#newTagsInput", function(e) {
  //e.preventDefault();
});

//Also allow tag-filters to submit by pressing enter.
$(document).on("keydown", ".tagAutocomplete", function(e) {
  if (e.which==13) {
    $(this).siblings(".submitButton").trigger("click");
    e.preventDefault();
    return false;
  }
});


$(".messageBox").scroll(function() {
  var scrollTop = $(this).scrollTop();
  var containerNotEmpty = $(this).find(".message").length != 0;
  var containerNotLocked = $(this).data("lockMessages")==false;
  var containerMaxed = $(this).data("maxPage");
  if (containerMaxed===undefined) containerMaxed=false;

  var context = getMessageContext();
  context["loadMore"]=true;
  context["noScroll"]=true;

  if (scrollTop==0 && containerNotEmpty &&
      containerMaxed==false && containerNotLocked) {
    var tags = getActiveTags();
    reloadMessages(".messageBox", tags, context);
  }
});


$(document).on("click", "#tagFilterSubmit", function() {
  var tags = getActiveTags();
  var context = getMessageContext();
  setActiveTags(tags); //Show the "clean" tags that are actually being used.
  reloadMessages(".messageBox", tags, context);
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
    reloadMessages(".messageBox", tagArray, {private:private});
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

if ($(".tagAutoComplete").length){
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
                },
        position:{collision:"flip flip"}
      });
    });
  });
}

//Clear tag inputs.
$(document).on("click", ".clearTagsButton", function() {
  $(this).closest(".inputContainer").find(".tagAutoComplete").val("");
});

//# # # # # # # # # # # # # # # # # # # # #
//Delete Cards
$(".deleteCardButton").click(function() {
  var card = $(this).closest(".card");

  $.post("/deleteCard/", { "cardName":card.attr("name") }, function(response) {
    if (response=="0") {
      $(card).hide()
    } else {
      alert("Oops... We couldn't delete the card. This is embarrasing...")
    }
  });

  //Hide the menu.
  $(this).closest(".menu").hide()
});

//Add Cards
var validCards = [];
$(".addCardButton").click(function() {
  //Only submit requests if the cardName is valid.
  var cardNameInput = $(this).siblings("input[name='newCardName']");
  var cardName = $(cardNameInput).val();

  //If the cardName is not in the validCards list, mark it as a .badInput.
  if (cardName===undefined || validCards.indexOf(cardName)<0) {
    $(cardNameInput).addClass("badInput");
    return false;
  } else {
    $(cardNameInput).removeClass("badInput");
  }

  $.post("/addCard/", { "cardName":cardName }, function(response) {
    if (response=="0") {
      alert("woo!");
    } else {
      alert("Oops... We couldn't add the card. This is embarrasing...")
    }
  });
});

//Apply autocomplete to the .cardAutoComplete elements that may exist.
if ($(".cardAutoComplete").length){
  $.get("/get_available_cards/", function(cardList) {
    //Update the validCards list.
    validCards = cardList;
    $( ".cardAutoComplete" ).autocomplete({
      source: validCards,
      select: function(){ $(this).removeClass("badInput") },
      position:{my: "center bottom", at: "center top", collision:"flip flip"}
    });
  });
}


//# # # # # # # # # # # # # # # # # # # # #
//Toggle .menu elements when the nearby .menuActivator is clicked.
$(".menuActivator").click(function() {
  var menu = $(this).next(".menu");
  if ($(menu).is(":visible")) {
    $(menu).hide();
  } else {
    $(menu).show();
  }

  return false;
});

$(".menu").click(function(event) {
  event.stopPropagation();
})

$("body").click(function() {
  $(".menu").hide();
});


//# # # # # # # # # # #
//jQuery Tooltips # # #
$(document).tooltip({
  tooltipClass: "tooltip",
  hide:{duration:200},
  show:{duration:100}
});


//# # # # # # # # # # # # # # # # # # # # # # # # # # # #
});
