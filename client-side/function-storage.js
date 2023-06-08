function drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH) {
  if (img.complete) ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
  else img.onload = function() { ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH); };
}

var alertBox = document.getElementById("alert-box");
function writeAlert(message) {
  alertBox.style.display = "block";
  var messageHolder = document.createElement("p");
  messageHolder.innerText = message;
  alertBox.appendChild(messageHolder);
  setTimeout(function() {
    alertBox.removeChild(messageHolder);
    alertBox.style.display = "none";
  }, 5000)
}

function calcCoord(axis, coord) {
  if (axis === "width") return gameWindow.offsetWidth * coord;
  else if (axis === "height") return gameWindow.offsetHeight * coord;
}

function findIndex(array, key, element) {
  var index = array.findIndex(function(obj) {
    return obj[key] === element;
  });
  return index;
}
function calculateOffset(object) {

}

importJSON = function(path, filter, success, error) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", path, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        var theData;

        if (filter === null) theData = data;
        else theData = data[filter];

        if (success) {
          success(theData);
          console.log("Data successfully loaded!");
        } else {
          if (error)
            error(xhr);
          console.log("Error loading data!");
        }
      }
    }
  };
  xhr.send(null);
};

importXML = function(path, success, error) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", path, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        if (success)
          success(xhr.responseXML);
        console.log("Data successfully loaded!");
      } else {
        if (error)
          error(xhr);
        console.log("Error loading data!");
      }
    }
  };
  xhr.send(null);
};

exportJSON = function(data, success, error) {
  var xhr = new XMLHttpRequest();
  let server = "http://localhost:3000/oogabooga";

  xhr.open("POST", server, true);

  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onreadystatechange = function() {

    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        if (success)
          success(xhr.responseXML);
        console.log(this.responseText);
      } else {
        if (error)
          error(xhr);
        console.log("Error sending data!");
      }
    }
  };
  xhr.send(data);
}

function getOBJ(id) {
  return document.getElementById(id);
}
