function disableSelectedInput(value, menu) {
  var otherVal = $(menu).val();

  //Disable the input that matches the 'value'
  $(menu).children().removeAttr("disabled");
  $(menu).children().filter( function() {
                        return $(this).html()===value;
                      }).attr("disabled", true);

  // If the current selection of the 'menu' is the previous 'value',
  //   reselect another option.
  if (otherVal==value){
    var unselected = $(menu).children("option[val!='"+value+"']")
    $(menu).val( unselected.first().html() );
  }
}
