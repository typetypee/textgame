function drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH){
  if(img.complete) ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
  else img.onload = function () {ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);};
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
