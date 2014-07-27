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

  var isActive = $(this).hasClass("active");
  if ($(this).attr("id")=="tagFilterPrivate"){
    $("#newMessagePrivate").toggleClass("active", isActive);
  }

});

//Submit a form when a user clicks the #submitFormButton only if it is valid.
$(document).on("keydown", "#form_password", function(e) {
  if (e.which==13) {
    $("#formSubmitButton").trigger("click");
  }
});
$(document).on("click", "#formSubmitButton", function(){
  var form = $(this).closest("form");
  var url = $(form).attr("action");

  //Validates the form contents and converts [{name:val},{name2:val2}, ...]
  //  to a more dictionary-like form: {name:val, name2:val2,...}
  //validateForm also sets .badInputs to allow for easy checking.
  var formContents = validateForm(form, url);
  if ($(form).find(".badInput").length) return false;

  $.post(url, formContents, function(response){
    if (response.substr(0,7)=="SUCCESS"){
      if (response.substr(8)=="HOME") {
        window.location.href="/home/";
      } else {
        window.location.reload();
      }
    } else if (response.substr(0,5)=="ERROR"){
      var error = response.split(" ")[1];
      var badElements="";
      if (error===undefined) {
        alert("Oops! Something broke... Tell FIG!");
      } else if (error=="PASS"){
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
      alert("OOPS!! We don't know what to do with that server result...")
    }
  });
});


//Update the .badInput for forms after a user inputs new info.
$(document).on("blur", ".fullScreenForm", function() {
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


$(document).on("click", ".activateTagMenu", function() {
  //Remove any other .tagMenu elements that may exist.
  var tagMenu = $(this).find(".tagMenu");
  if ($(tagMenu).length==0) {
    var menu = $(buildTagMenu())
    $(this).append(menu);
  } else {
    $(tagMenu).show();
  }
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

//Delete Message button.
$(document).on("click", ".messageDeleteButton", function() {
  if (confirm("Are you sure? This action can't be undone.")) {
    $message = $(this).closest(".message");
    var did = $message.attr("data-did");

    $.post("/message/delete/", {"did":did}, function(response) {
      if (response=="SUCCESS") {
        $message.remove();
      } else {
        alert("Can't delete that message!");
      }
    });
  }
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

  if ($(".card[name='"+cardName+"']").length){
    alert("Card already set!");
    $(cardNameInput).addClass("badInput");
    return false;
  }

  $.post("/addCard/", { "cardName":cardName }, function(response) {
    if (response=="0") {
      location.reload(true);
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
//jQuery DatePicker # #
$(".dateInput").datepicker({
  "onSelect": function(newDate) {
    //Set the value since DatePickers apply changes AFTER the `change` event.
    this.value = newDate;
    $(this).trigger("blur");
  }

});
$(".dateInput").each(function() {
  if ($(this).val()===""){
    $(this).datepicker("setDate", "0");
  }
});
$(".dateInput[noPastDates=true]").datepicker("option", "minDate", 0);

//# # # # # # # # # # #
//TimePicker  # # # # #
$(document).on("change", ".timeInput", function() {
  var dirtyTime = $(this).val().toUpperCase()
                         .replace(/[\s.]/g, "");

  //Allow a few keywords to decide on the time.
  if (dirtyTime==="" || dirtyTime==="midnight") dirtyTime="12:00am";
  if (dirtyTime==="noon") dirtyTime="12:00pm";
  if (dirtyTime==="now") {
    var time = new Date();
    dirtyTime = time.getHours() + ":" + time.getMinutes();
  }

  //Give the user options for how they can write the day.
  var hours;
  var minutes;
  if (/^[0-9]+(AM|PM)?$/.test(dirtyTime)){
    hours = String(dirtyTime.replace(/(AM|PM)/,""));
    minutes = 0;
  } else {
    var colon = dirtyTime.indexOf(":");
    hours = parseInt(dirtyTime.slice(0, colon).replace(/[a-zA-Z]/g,""));
    minutes = parseInt(dirtyTime.slice(colon+1).replace(/[a-zA-Z]/g,""));
  }

  var calculatedPeriod = "PM";
  if (hours > 12){
    hours %= 12;
    if (hours===0) hours = 12;
  }

  minutes = minutes % 60
  minutes = (minutes<9) ? "0"+String(minutes) : String(minutes);

  var periodMatch = dirtyTime.match(/(AM|PM)/);
  var period = (periodMatch!==null) ? periodMatch[0] : calculatedPeriod;

  var cleanTime = String(hours) + ":" + minutes + period;
  $(this).val(cleanTime);
})
$(".timeInput").trigger("change");

//# # # # # # # # # # #
//jQuery Tooltips # # #
$(document).tooltip({
  tooltipClass: "tooltip",
  hide:{duration:200},
  show:{duration:100}
});


//# # # # # # # # # # # # # # # # # # # # # # # # # # # #
});
