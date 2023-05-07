
function setBG(url) {
    gameWindow.style.backgroundImage = "url(" + url + ")";
}

function createIMG(url, name, x, y) {
  var image = document.createElement("img");
  image.src = url;
  setImagePosition(x, y, image);
  image.classList.add("character");
  image.id = name;
  gameWindow.appendChild(image);


}

function removeIMG(url) {
  gameWindow.removeChild(document.getElementById(url));
}
