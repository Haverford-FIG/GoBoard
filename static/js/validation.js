//# # # #  Message Validation  # # # # # # # # # # # # #
//If there is an error, "throw" a message.
function validateMessage(msg){
  if (msg=="") throw "Empty message!";
}


//# # # #  Tag Validation  # # # # # # # # # # # # #
//Takes a "dirty" tagString and converts it to a cleaned tagArray
//eg: "#man/ny  #dir  ty# tags " ==> ["many, "dirty", "tags"]
function cleanTags(tagString){
  //Get the valid characters from the string.
  var validChars = tagString.match(/#|[a-zA-Z]/g);
  if (validChars===null) validChars=[];

  //And convert the string back into a valid array.
  var tagArray = validChars.join("").split("#")
  if (tagArray.length) tagArray.shift(); //Be wary of the starting hash...

  return tagArray;
}

//# # # #  Validaiton Classes  # # # # # # # # # # # # #
function applyTempErrorClass(location) {
  $(location).addClass('badInput');
  setTimeout(function() {
    $(location).removeClass('badInput', 300);
  }, 500);
}

function applyTempGoodClass(location) {
  $(location).addClass('goodInput');
  setTimeout(function() {
    $(location).removeClass('goodInput', 100);
  }, 100);
}


//jQuery bindings for Specifically Validation.
$(document).ready(function() {
//# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

$(".tagAutoComplete").keypress(function(e){
  var c = String.fromCharCode(e.which) 

  //Only allow certain characters.
  var re = new RegExp(/#|[a-zA-Z]|\s/);
  if (!re.test(c)){
    return false; 
  }

  var input = $(this).val();
  var lastChar = input.slice(-1);
  switch(c){
    case " ":
      var alpha = new RegExp(/[a-zA-Z]/);
      if (!alpha.test(lastChar)) return false;
      break;
    case "#":
      var alphaSpace = new RegExp(/^|\s|[a-zA-Z]/);
      if (!alphaSpace.test(lastChar) || lastChar=="#") return false;
      break;
    default:
      var alphaHash = new RegExp(/#|[a-zA-Z]/);
      if (!alphaHash.test(lastChar)) return false;
  }

});


//# # # # # # # # # # # # # # # # # # #  # # # # # # # # # # # # #
});
