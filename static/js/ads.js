function loadAds() {
  $(".bannerAdContainer").each(function(){
    var banner = $(this);
    $.get("/ads/get/", function(response) {
      banner.html(response);
    });
  });
}
