//WHERE ALL CONVERGE INTO ONE

window.addEventListener("keydown", function(e){ //if a key was pressed
  e.preventDefault();

  if(e.keyCode === 32 && gameState === "text") advanceText();

})

window.addEventListener("click", function(e) {
  if(textSystem.isQuestion === false && gameState === "text") {
    advanceText();
  }

})

function updateGameState() {
  if(gameState === "text") document.getElementById("text-box").style.display = "block";
    else document.getElementById("text-box").style.display = "none";
  if(gameState === "interact") {

  }
  openCloseInventory();
}

eventRun();
function loop() { //loops all functions every few frames
  updateGameState();

  window.requestAnimationFrame(loop);
}
loop();
