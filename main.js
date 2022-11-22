var textBox = document.getElementById("text");
var textName = document.getElementById("name");
var gameWindow = document.getElementById("game-window");

textBox.innerHTML = "AHH";
var answerBoxes = Array.prototype.slice.call(document.getElementsByClassName("answer"));

//VARIABLE STORAGE AREA {
var gameState = "text"; //text, interact, inventory
var jsonData = "";
var currentBranch = ":D";
var textSystem = {
  currentLine: 0, //current line in text
  isQuestion: false, //determines whether the current line is a choice
  option: 0, //the choice selected
}

//}

function retrieveBranch(branchName) {
  textSystem.currentLine = 0;
  textSystem.option = 0;

  importData("json/speech.json", function(json){
   jsonData = JSON.parse(json);
   currentBranch = jsonData[branchName];
  })
}

retrieveBranch("hooman");
