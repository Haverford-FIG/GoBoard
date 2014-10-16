function buildLocationTimes(locals) {
  var options = "";
  for (var i=0; i < locals.length; i++){
    options += "<option val='"+locals[i]+"'>"+locals[i]+"</option>";
  }

  newHTML = "<select id='blueBusStart'>"+options+"</select>";
  newHTML += "<div class='fillLineText'>to</div>";
  newHTML += "<select id='blueBusEnd'>"+options+"</select>"
  $("#blueBusLocationContainer").html(newHTML);

  updateBlueBusTimes();
}

function initializeBlueBus() {
  var url = "/get_BlueBus_locations/";
  $.get(url, function(locationJSON){
    buildLocationTimes(locationJSON);
  });
}

function updateBlueBusTimes() {
  var startLocal = $("#blueBusStart").val()
  disableSelectedInput( startLocal, "#blueBusEnd" );

}

$(document).on("change", "#blueBusStart", updateBlueBusTimes);

initializeBlueBus();
