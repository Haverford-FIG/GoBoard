function buildGrubHTML(grubArray) {
  var HTML = "";
  var vegan = "<img class='veganIcon' src='static/icons/vegan.png' title='Vegan'/>";
  for (var i=0; i<grubArray.length; i++) {
    var food = grubArray[i];
    food = food.replace(/ +V *$/,vegan);
    HTML += "<div class='grubItem'>"+food+"</div>"
  }
  return HTML+"<br />";
}

function load_DC_grub(){
  $.get("/get_DC_grub/", function(response) {
    var HTML = "";

    for (var meal in response) {
      if (response.hasOwnProperty(meal)) {
        HTML += "<div class='grubMeal'>"+meal+"</div>";
        HTML += buildGrubHTML(response[meal]);
      }
    }

    $("#DCGrubResults").html( HTML );

  }).fail(function() {
    $("#DCMeal").html( "Couldn't load any grub for today." );
  });
}

load_DC_grub();
