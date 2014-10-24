function buildGrubHTML(grubArray) {
  var HTML = "";
  for (var i=0; i<grubArray.length; i++) {
    HTML += "<div class='grubItem'>"+grubArray[i]+"</div>"
  }
  return HTML;
}

function load_DC_grub(){
  $.get("/get_DC_grub/", function(response) {
    $("#DCMeal").html( response.meal );
    $("#DCGrubResults").html( buildGrubHTML(response.items) );
  });
}

load_DC_grub();
