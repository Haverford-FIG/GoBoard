//Get an object of the form {key:val, ...} composed of the key-vals
//  in the search parameters in the URL.
function getURLParams(paramQuery){
  //Variable Setup.
  var URL_params = window.location.search.substr(1)
  var paramList = URL_params.split("?");
  var paramObj = {};

  for (var i=0; i < paramList.length; i++){
    var paramTuple = paramList[i].split("=");
    paramObj[paramTuple[0]]=paramTuple[1];
    
  }

  if (paramQuery===undefined) return paramObj;
  return paramObj[paramQuery];
}

