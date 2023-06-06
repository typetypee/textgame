const backButton = getOBJ("back");

backButton.addEventListener("click", function(){
    console.log(getOBJ(currentLevel).parentNode)
  if(getOBJ(currentLevel).parentNode.id !== "levels") {
    console.log(getOBJ(currentLevel).parentNode)
    runLevel(getOBJ(currentLevel).parentNode.id);
  }
})
