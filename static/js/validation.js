//# # # #  Message Validation  # # # # # # # # # # # # #
//If there is an error, "throw" a message.
function validateMessage(msg){
  if (msg=="") throw "Empty message!";
}



//# # # #  Tag Validation  # # # # # # # # # # # # #
function removeDuplicateTags(tagArray){
  if (tagArray.length==0) return [];

  var uniqueTagArray = [];
  $.each(tagArray, function(index, entry){
    if (uniqueTagArray.indexOf(entry)<0) uniqueTagArray.push(entry);
  });

  return uniqueTagArray;
}


//Takes a "dirty" tagString and converts it to a cleaned uniqueTagArray.
function cleanTags(tagString){
  //Get the valid characters from the string.
  var tagArray = tagString.match(/((@|#)[a-zA-Z]+[a-zA-Z1-9]*)+?/g)
  if (tagArray===null) tagArray=[];

  return removeDuplicateTags(tagArray);
}

//Returns 'true' if a string is in the proper tag format.
function isValidTag(str){
  var re = RegExp("^(@|#)[a-zA-Z]+[a-aA-Z1-9]*$");
  return re.test(str);
}


//# # # #  Form Validation  # # # # # # # # # # # # #
function validateForm(form, url){
  //Variable Setup.
  var formContent = {};
  var textInput = "input[type=text],input[type=password], input[type=email], select";

  //Clear any previous .badInput elements.
  $(form).find(".badInput").removeClass("badInput");

  //Perform different validations for different forms.
  switch (url){
    case "/update_settings/":
      var noEmpty = ["currentPass","email"];
      $(form).find(textInput).each(function(i){
        var name = $(this).attr("name");
        var val = $(this).val();
        //Don't allow empty values.
        if (noEmpty.indexOf(name)>=0 && val=="") applyErrorClass($(this), false);
        formContent[name]=val;
      });

      //Collect any checkbox values.
      $(form).find("input[type=checkbox]").each(function(i){
        var name = $(this).attr("name");
        var val = $(this).is(":checked") ? "y" : "n";
        formContent[name]=val;
      });

      //Make sure the grad_range is sensical if specified.
      var val = formContent["grad_year"];
      if (val=="" || !isValidGradYear(val)) {
        applyErrorClass($(form).find("#form_gradYear"), false);
      }

      //Make sure the repeated new pass is the same.
      if (formContent["newPass"]!=formContent["newPassRepeat"]){
        applyErrorClass($(form).find("input[name=newPassRepeat]"), false)
      }

      //Make sure the email has an "@" and it is appropriately placed.
      var email = formContent["email"];
      if (email.indexOf("@")<=0 || email.indexOf("@")==email.length-1){
        applyErrorClass($(form).find("input[name=email]"), false)
      }
      break;

    case "/events/submit/":
      var noEmpty = ["title", "location", "category", "description"];

      $(form).find("input, select, textarea").each(function(i){
        var name = $(this).attr("name");
        var val = $(this).val();

        //Don't allow empty values.
        if (noEmpty.indexOf(name)>=0 && val=="") applyErrorClass($(this), false);
        formContent[name]=val;
      });

      $(form).find(".timeInput").each(function(i){
        var val = $(this).val();
        //Don't allow empty values.
        var validDate = /^[1-2]?[0-9]:[0-5][0-9](AM|PM)$/;
        if (! validDate.test(val)) applyErrorClass($(this), false);
      });

      $(form).find(".dateInput").each(function(i){
        var val = $(this).val();
        //Don't allow empty values.
        var validDate = /^[0-3][0-9]\/[0-3][0-9]\/[0-9]+$/g;
        if (! validDate.test(val)) applyErrorClass($(this), false);
      });

      //Collect any checkbox values.
      $(form).find("input[type=checkbox]").each(function(i){
        var name = $(this).attr("name");
        var val = $(this).is(":checked") ? "y" : "n";
        formContent[name]=val;
      });


      break;


    case "/ads/submit/":
      var noEmpty = ["startDate","endDate", "text"];

      $(form).find("input, select").each(function(i){
        var name = $(this).attr("name");
        var val = $(this).val();

        //Don't allow empty values.
        if (noEmpty.indexOf(name)>=0 && val=="") applyErrorClass($(this), false);
        formContent[name]=val;
      });

      $(form).find(".dateInput").each(function(i){
        var val = $(this).val();
        //Don't allow empty values.
        var validDate = /[0-3][0-9]\/[0-3][0-9]\/[0-9]+/g;
        if (! validDate.test(val)) applyErrorClass($(this), false);
      });

      break;

    case "/accounts/create/":
      var noEmpty = ["newPass","newPassRepeat", "username", "email"];
      $(form).find("input, select").each(function(i){
        var name = $(this).attr("name");
        var val = $(this).val();
        //Don't allow empty values.
        if (noEmpty.indexOf(name)>=0 && val=="") applyErrorClass($(this), false);
        formContent[name]=val;
      });

      //Make sure the repeated new pass is the same.
      if (formContent["newPass"]!=formContent["newPassRepeat"]){
        applyErrorClass($(form).find("input[name=newPassRepeat]"), false)
      }

      //Make sure the email has an "@" and it is appropriately placed.
      var email = formContent["email"];
      var domain = email.split("@")[1];
      if (email.indexOf("@")<=0 || email.indexOf("@")==email.length-1 ||
         validDomains.indexOf(domain)<0){
        applyErrorClass($(form).find("input[name=email]"), false)
      }

      //Make sure the username is in hash format.
      if (!isValidTag("@"+formContent["username"])){
        applyErrorClass($(form).find("input[name=username]"), false)
      }

      //Make sure the grad_range is sensical if specified.

      var val = formContent["grad_year"];
      if (val=="" || !isValidGradYear(val)) {
        applyErrorClass($(form).find("#form_gradYear"), false);
      }
      break;

    case "/accounts/forgot/":
      var noEmpty = ["email"];
      $(form).find("input").each(function(i){
        var name = $(this).attr("name");
        var val = $(this).val();
        //Don't allow empty values.
        if (noEmpty.indexOf(name)>=0 && val=="") applyErrorClass($(this), false);
        formContent[name]=val;
      });

      //Make sure the email has an "@" and it is appropriately placed.
      var email = formContent["email"];
      if (email.indexOf("@")<=0 || email.indexOf("@")==email.length-1){
        applyErrorClass($(form).find("input[name=email]"), false)
      }
      break;

    case "/accounts/login/":
      var noEmpty = ["password","username","email"];
      $(form).find("input").each(function(i){
        var name = $(this).attr("name");
        var val = $(this).val();
        //Don't allow empty values.
        if (noEmpty.indexOf(name)>=0 && val=="") applyErrorClass($(this), false);
        formContent[name]=val;
      });
      break;
    default:
      throw "Uh oh... validateForm not defined for '"+url+"'";

  }

  return formContent
}


//# # # #  Specific Input Validators   # # # # # # # # # # # # #

function isValidGradYear(year) {
  if (isNaN(year)) return false;
  margin = 40; //The "window" for a valid year.
  this_year = (new Date()).getFullYear();
  return (this_year-margin <= year) && (year <= this_year+margin);
}



//# # # #  Validation Classes  # # # # # # # # # # # # #
function applyErrorClass(location, timeout) {
  if (timeout===undefined) timeout=true;

  $(location).addClass('badInput');

  if (timeout){
    setTimeout(function() {
      $(location).removeClass('badInput', 300);
    }, 500);
  }
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
  var c;
  switch (e.which){
    case 8:
      c = "BACKSPACE";
      break;

    case 13:
      c = "ENTER";
      break;

    default:
      c = String.fromCharCode(e.which);
  }

  //Only allow certain characters.
  var re = new RegExp(/(#|@|[a-zA-Z1-9]|\s)/);
  if (c == "BACKSPACE") {
    var old = $(this).val();
    $(this).val( old.slice(0, old.length-1) );
    return false;
  } else if (c=="ENTER") {
    return false;
  } else if (!re.test(c)){
    return false;
  }

  var input = $(this).val()
                     .replace(/^\s*#\s+/g,"")
                     .replace(/\s+#\s+/g," ");
  $(this).val( input );
  var lastChar = input.slice(-1);
  switch(c){
    case " ":
      var alphaNum = new RegExp(/[a-zA-Z1-9]/);
      if (!alphaNum.test(lastChar)) return false;
      break;
    case "@":
    case "#":
      var alphaSpace = new RegExp(/^|\s|[a-zA-Z]/);
      if (!alphaSpace.test(lastChar) || "#"==lastChar || "@"==lastChar) return false;
      break;
    default:
      var validChars = new RegExp(/#|@|[a-zA-Z1-9]/);
      if (lastChar.match(/@|#/) && c.match(/[1-9]/)) return false;

      if (lastChar=="" || lastChar==" ") {
        $(this).val( input + "#" );
      } else if (!validChars.test(lastChar)) {
        return false;
      }
  }
});


//# # # # # # # # # # # # # # # # # # #  # # # # # # # # # # # # #
});
