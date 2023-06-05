//TEXT SYSTEM {

var textData = "";
var textSystem = {
  currentLine: 1, //current line in text
  isQuestion: false, //determines whether the current line is a choice
  option: 0, //the choice selected
}

function retrieveBranch(branchName) {
  textSystem.currentLine = 0;
  textSystem.option = 0;

  importJSON("json/speech.json", branchName, function(json) {
    textData = json;
    advanceText();
  })
}

function findLabel(label) {
  var index = findIndex(textData, "label", label);
  return textData.indexOf(textData[index]);
}

function advanceText() {

  var currentStep = textData[textSystem.currentLine]; //the current line being displayed in the story

  if (textSystem.currentLine < textData.length) { //if the story is not over yet
    //**PLAYER RECIVES ITEM**//
    if (undefined !== currentStep.recieveItem) {
      var itemList = currentStep.recieveItem.items
      addToInventory(itemList);
      for (var i = 0; i < itemList.length; i++) {
        writeAlert("You recieved " + itemList[i].name + " x" + itemList[i].amount);
      }
    }

    if (undefined !== currentStep.n) textName.innerText = currentStep.n; //...set the name parameter of the textbox as current name

    if (undefined !== currentStep.m) { //if the "message" of the current dialogue is not undefined...
      textBox.innerText = currentStep.m; //...set the content parameter of the textbox as the current content

      //if this dialogue 1 has a "next" parameter, then a dialogue 2 has a "label" that corresponds with it.
      if (undefined !== currentStep.next) textSystem.currentLine = findLabel(currentStep.next); //so the dialogue 2 is found in the story
      else { //the dialogue 1 has no "next" parameter
        textSystem.currentLine++; //just go to the next dialogue in the story
      }
    } else if (undefined !== currentStep.question) { //the dialogue is not a "messasge", but a "question"
      if (textSystem.isQuestion === true) { //the isQuestion state has already been activated. change the text to the response to the player's answer
        textSystem.currentLine = findLabel(currentStep.answers[textSystem.option].next);
        currentStep = textData[textSystem.currentLine];
        textBox.innerText = currentStep.m;
        if (undefined !== currentStep.n) {//if the name is not undefined...
          textName.innerText = currentStep.n; //...display it
        }
        //make the answer box disappear
        document.getElementById("answer-container").style.display = "none";
        for (var q = 0; q < answerBoxes.length - 1; q++) {
          answerBoxes[q].style.display = "none";
        }

        textSystem.isQuestion = false; //question process is over. set it to false now

      } else { //erm....it's a question but the variable has not been activated yet. set up the question so the player can respond
        textSystem.isQuestion = true;

        //display question
        textBox.innerText = currentStep.question;

        //display answers
        document.getElementById("answer-container").style.display = "block";

        for (var w = 0; w < answerBoxes.length - 1; w++) { //hide all the answers first...
          answerBoxes[w].style.display = "none";
        }

        for (var i = 0; i < currentStep.answers.length; i++) { //display the ones that need to be displayed
          answerBoxes[i].style.display = "block";
          answerBoxes[i].innerText = (currentStep.answers[i].m); //and display their text
        }
      }

    }
  }

  else if (textSystem.currentLine === textData.length) {
    gameState = "interact"
    textData = "";
  }

}

//add event listener click function to answer buttons
for (var i = 0; i < answerBoxes.length - 1; i++) {
  answerBoxes[i].addEventListener("click", function() {
    if (textSystem.isQuestion === true) {
      textSystem.option = answerBoxes.indexOf(this);
      advanceText();
    }
  });
}

function runText(branch, character) {
  if (gameState === "interact") {
    if (branch === '') {

      var index = findIndex(l[character][currentScene], "c", false)
      retrieveBranch(l[character][currentScene][index].n);

      if (index === l[character][currentScene].length - 1 || l[character][currentScene][index].c === undefined) console.log(":)")
      else l[character][currentScene][index].c = true;

      gameState = "text";
    }
    else {
      retrieveBranch(branch);
      gameState = "text";
    }
  }

}

//}
