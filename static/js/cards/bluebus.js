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

function displayBusTimes(timeArray){
  $("#blueBusTimesContainer").html("Loading");

  var times = "";
  for (var i=0; i < timeArray.length; i++){
    times += "<div class='blueBusTime'>"+timeArray[i]+"</div>";
  }

  $("#blueBusTimesContainer").html(times);
}


function updateBlueBusTimes() {
  var startLocal = $("#blueBusStart").val()
  disableSelectedInput( startLocal, "#blueBusEnd" );

  var url = "/get_BlueBus_times/";
  var start = $("#blueBusStart").val();
  var end = $("#blueBusEnd").val();
  $.get(url, {"start":start, "end":end},
    function(timesJSON){
      displayBusTimes(timesJSON);
  })
}

$(document).on("change", "#blueBusStart", updateBlueBusTimes);
$(document).on("change", "#blueBusEnd", updateBlueBusTimes);

initializeBlueBus();
