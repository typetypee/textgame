//WHERE ALL CONVERGE INTO ONE

window.addEventListener("keydown", function(e){ //if a key was pressed
  e.preventDefault();

  if(e.keyCode === 32 && gameState === "text") advanceText();

})

window.addEventListener("click", function(e) {
  if(textSystem.isQuestion === false && gameState === "text") advanceText();
})

function updateGameState() {
  openCloseInventory();
}


function loop() { //loops all functions every few frames
  updateGameState();

  window.requestAnimationFrame(loop);
}
loop();
