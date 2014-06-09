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

  var uniqueTagArray = [];
  $.each(tagArray, function(index, entry){
    if (uniqueTagArray.indexOf(entry)<0) uniqueTagArray.push(entry);
  });

  return uniqueTagArray;
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
      
      //Make sure the repeated new pass is the same.
      if (formContent["newPass"]!=formContent["newPassRepeat"]){
        applyErrorClass($(form).find("input[name='newPassRepeat']"), false)
      }

      //Make sure the email has an "@" and it is appropriately placed.
      var email = formContent["email"];
      if (email.indexOf("@")<=0 || email.indexOf("@")==email.length-1){
        applyErrorClass($(form).find("input[name='email']"), false)
      }

      break;

    case "/accounts/create/":
      var noEmpty = ["newPass","newPassRepeat", "username", "email"];
      $(form).find("input").each(function(i){
        var name = $(this).attr("name");
        var val = $(this).val();
        //Don't allow empty values.
        if (noEmpty.indexOf(name)>=0 && val=="") applyErrorClass($(this), false);
        formContent[name]=val;
      });

      //Make sure the repeated new pass is the same.
      if (formContent["newPass"]!=formContent["newPassRepeat"]){
        applyErrorClass($(form).find("input[name='newPassRepeat']"), false)
      }

      //Make sure the email has an "@" and it is appropriately placed.
      var email = formContent["email"];
      if (email.indexOf("@")<=0 || email.indexOf("@")==email.length-1){
        applyErrorClass($(form).find("input[name='email']"), false)
      }
      break;

    case "/accounts/login/":
      var noEmpty = ["password","username"];
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
