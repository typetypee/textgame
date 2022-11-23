function drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH){
  if(img.complete) ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
  else img.onload = function () {ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);};
}

function calcCoord(axis, coord) {
  if(axis === "width") return gameWindow.offsetWidth * coord;
  else if(axis === "height") return gameWindow.offsetHeight * coord;
}

function findIndex(array, key, element) {
  var index = array.findIndex(function(obj){
        return obj[key] === element;
  });
  return index;
}
function calculateOffset(object) {

}

importData = function(path, success, error) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", path, true);
  xhr.onreadystatechange = function()  {
    if(xhr.readyState === XMLHttpRequest.DONE) {
      if(xhr.status === 200) {
        if(success)
          success(xhr.responseText);
          console.log("Data successfully loaded!");
      } else {
          if(error)
            error(xhr);
            console.log("Error loading data!");
      }
    }
  };
  xhr.send(null);
};

importXML = function(path, success, error) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", path, true);
  xhr.onreadystatechange = function()  {
    if(xhr.readyState === XMLHttpRequest.DONE) {
      if(xhr.status === 200) {
        if(success)
          success(xhr.responseXML);
          console.log("Data successfully loaded!");
      } else {
          if(error)
            error(xhr);
            console.log("Error loading data!");
      }
    }
  };
  xhr.send(null);
};
