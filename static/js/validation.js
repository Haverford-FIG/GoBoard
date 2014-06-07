//# # # # # # # # # # # # # # # # # # #  # # # # # # # # # # # # #
//Function Declarations

//Takes a "dirty" tagString and converts it to a cleaned tagArray
//eg: "#man/ny  #dir  ty# tags " ==> ["many, "dirty", "tags"]
function cleanTags(tagString){
	tagString = tagString.match(/#|[a-zA-Z]/g).join("");
	var tagArray = tagString.split("#")
	if (tagArray.length) tagArray.shift(); //Be wary of the starting hash...
	return tagArray;
}



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
