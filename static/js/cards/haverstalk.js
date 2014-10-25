function reloadHaverStalk() {
  var query = $("#HaverStalkSearch").val();
  if (query != "") {
    $.get("/query_haverstalk", {"query":query}, function(response) {
      $("#HaverStalkResults").html(response);
    });
  }
}

$("#HaverStalkSearch").keyup(reloadHaverStalk);
