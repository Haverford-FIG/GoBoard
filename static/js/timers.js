
// # # # # # # Message Checker # # # # # # # # # # # #
//Start the #otherActiveUserCount timer.
function checkMessages(container){
  var tags = getActiveTags();
  var context = getMessageContext();
  context["noScroll"]=true;
  reloadMessages(".messageBox", tags, context);
}


// # # # # # # User Updaters # # # # # # # # # # # #
//Start the #otherActiveUserCount timer.
function updateUserCounter(){
  $.get("/userCount/", function(response){
    var newHTML = buildUserCounter(parseInt(response)-1);
    $("#otherActiveUserCount").html(newHTML);
  });
}


// # # # # # # Tag Updaters # # # # # # # # # # # #
//Load the most recently used tags into the #tagbox.
function reloadRecentTags(){
  $.get("/get_recent_tags/", function(tags) {
    $("#tagbox").html( buildUpdateTags(tags) );
  });
}

//Load the currently "trending" tags into the #tagbox.
function reloadTrendingTags(){
  $.get("/get_trending_tags/", function(tags) {
    $("#tagbox").html( buildUpdateTags(tags) );
  });
}

//Set the currentTagBoxUpdater to whatever the currently
//  process is. The "default" is set in "main.js".
//  Also immediately trigger the request function.
var currentTagBoxUpdater;
function setTagBox(choice){
  //Variable Setup.
  var activeClass = "activeUpdateContainerChoice";
  var newActiveChoice;

  //Stop whatever the current tag "updater" is doing.
  clearInterval(currentTagBoxUpdater);

  //And set it to a new update "process."
  switch(choice){
    case "trending":
      newActiveChoice = $(".updateContainerOption[value='trending tags']");
      reloadTrendingTags()
      currentTagBoxUpdater = setInterval(reloadTrendingTags, 6*1000);
      break;
    case "recent":
      newActiveChoice = $(".updateContainerOption[value='recent tags']");
      reloadRecentTags()
      currentTagBoxUpdater = setInterval(reloadRecentTags, 6*1000);
      break;
    default:
      throw "UH OH. setTagBox has no update option '"+choice+"'.";
  }

  //Give the newActiveChoice the .activeUpdaterChoice class.
  $("."+activeClass).removeClass(activeClass);
  $(newActiveChoice).addClass(activeClass)

}


