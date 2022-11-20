var textBox = document.getElementById("text");
var textName = document.getElementById("name");
textBox.innerHTML = "AHH";
var answerBoxes = Array.prototype.slice.call(document.getElementsByClassName("answer"));

var data = {
  data: "", //all the data
  story: "", //the current story in the data
  currentLine: 0, //current line in text
  isQuestion: false, //determines whether the current line is a choice
  option: 0, //the choice selected
}

importData("json/speech.json", function(json){
 data.data = JSON.parse(json);
 data.story = data.data.shrek

})

//TEXT SYSTEM {
function findLabel(label) {
    var index = data.story.findIndex(function(obj){
          return obj.label === label;
    });
    return data.story.indexOf(data.story[index]);
}

function advanceText() {
  var currentStep = data.story[data.currentLine]; //the current line being displayed in the story

  if(data.currentLine < data.story.length) { //if the story is not over yet
    if(undefined !== currentStep.n) { //if the name of the current dialogue is not undefined...
      textName.innerText = currentStep.n; //...set the name parameter of the textbox as current name
    }
    if(undefined !== currentStep.m) { //if the "message" of the current dialogue is not undefined...
      textBox.innerText = currentStep.m; //...set the content parameter of the textbox as the current content

      //if this dialogue 1 has a "next" parameter, then a dialogue 2 has a "label" that corresponds with it.
      if(undefined !== currentStep.next) data.currentLine = findLabel(currentStep.next); //so the dialogue 2 is found in the story
      else { //the dialogue 1 has no "next" parameter
        data.currentLine++; //just go to the next dialogue in the story
      }
    } else if (undefined !== currentStep.question) { //the dialogue is not a "messasge", but a "question"
      if(data.isQuestion === true) { //the isQuestion state has already been activated. change the text to the response to the player's answer
        data.currentLine = findLabel(currentStep.answers[data.option].next);
        currentStep = data.story[data.currentLine];
        textBox.innerText = currentStep.m;
        if(undefined !== currentStep.n) {//if the name is not undefined...
          textName.innerText = currentStep.n; //...display it
        }
        //make the answer box disappear
        document.getElementById("answer-container").style.display = "none";
        for(var q = 0; q < answerBoxes.length - 1; q++) {
          answerBoxes[q].style.display = "none";
        }

        data.isQuestion = false; //question process is over. set it to false now

      } else { //erm....it's a question but the variable has not been activated yet. set up the question so the player can respond
        data.isQuestion = true;

        //display question
        textBox.innerText = currentStep.question;

        //display answers
        document.getElementById("answer-container").style.display = "block";

        for(var w = 0; w < answerBoxes.length - 1; w++) { //hide all the answers first...
          answerBoxes[w].style.display = "none";
        }

        for(var i = 0; i < currentStep.answers.length; i++) { //display the ones that need to be displayed
          answerBoxes[i].style.display = "block";
          answerBoxes[i].innerText = (currentStep.answers[i].m); //and display their text
        }
      }

    }
  }
}

window.addEventListener("keydown", function(e){ //if a key was pressed
  e.preventDefault();

  if(e.keyCode === 32) advanceText();

/**
  if(data.isQuestion === true) {
    if(e.keyCode === 38) {
      if(data.option === 0) data.option = answerBoxes.length - 1;
      else data.option--;
    }
    if(e.keyCode === 40) {
      if(data.option === answerBoxes.length - 1) data.option = 0;
      else data.option++;
    }
    for(var i = 0; i < answerBoxes.length; i++) {
      answerBoxes[i].style.backgroundColor = "white"
    }
    answerBoxes[data.option].style.backgroundColor = "red";
  }
**/

})
window.addEventListener("click", function(e) {
  if(data.isQuestion === false) advanceText();
})

for(var i = 0; i < answerBoxes.length - 1; i++) {
  answerBoxes[i].addEventListener("click", function() {
    if(data.isQuestion === true) {
      data.option = answerBoxes.indexOf(this);
      advanceText();
    }
  });
}

//}

function loop() { //loops all functions every few frames

  window.requestAnimationFrame(loop);
}
loop();
