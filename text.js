//TEXT SYSTEM {
function findLabel(label) {
    var index = findIndex(currentBranch, "label", label);
    return currentBranch.indexOf(currentBranch[index]);
}

function setImagePosition(x, y, element) {//set the position of an element, given coordinates, and then the element to be moved
  /**ADJUST THE CHARACTER X**/
    if(undefined !== x) {
/**PREDEFINED POSITIONS**/
      if(x === "left") element.style.left = "0px";
      else if (x === "right") element.style.right = "0px";
      else if (x === "center") element.style.left = gameWindow.offsetWidth*0.5-(element.offsetWidth*0.5);
/**CUSTOM POSITION**/
      else element.style.left = x + "px";
      //calcCoord("width", x)
    }
  /**ADJUST THE CHARACTER Y**/
    if(undefined !== y) {
/**PREDEFINED POSITIONS**/
      if(y === "top") element.style.top = "0px";
      else if (y === "bottom") element.style.bottom = "0px";
      else if (y === "center") element.style.top = gameWindow.offsetHeight*0.5-(element.offsetHeight*0.5);
/**CUSTOM POSITION**/
      else element.style.top = y + "px";
    }
}

function advanceText() {
  var currentStep = currentBranch[textSystem.currentLine]; //the current line being displayed in the story

  if(textSystem.currentLine < currentBranch.length) { //if the story is not over yet
/**IMAGE DISPLAYING**/
    if(undefined !== currentStep.createImg) { //this step specifies images to be created
      if(undefined!== currentStep.createImg.bg) { //display background
        setBG(currentStep.createImg.bg);
      }
    /**DISPLAY CHARACTERS**/
      if(undefined !== currentStep.createImg.char) {
        for(var i = 0; i < currentStep.createImg.char.length; i++) {
          var char = currentStep.createImg.char[i];
          createIMG(char.url, char.name, char.x, char.y);

        }
      }
    }
/**ADJUST THE CHARACTER POSITION**/
  if(undefined !== currentStep.moveImg) {
    if(undefined !== currentStep.moveImg.char) {
      for(var i = 0; i < currentStep.moveImg.char.length; i++) {
        var imgToMove = currentStep.moveImg.char[i].name;
        setImagePosition(currentStep.moveImg.char[i].x, currentStep.moveImg.char[i].y, document.getElementById(imgToMove));

      }
    }
  }

/**IMAGE REMOVAL**/
  if(undefined !== currentStep.removeImg) { //this step specifies images to be removed
  /**REMOVE CHARACTERS**/
    if(undefined !== currentStep.removeImg.char) {
      for(var i = 0; i < currentStep.removeImg.char.length; i++) {
        removeIMG(currentStep.removeImg.char[i].name);
      }
    }
  }
  //**PLAYER RECIVES ITEM**//
    if(undefined !== currentStep.recieveItem) {
      var itemList = currentStep.recieveItem.items
      addToInventory(itemList);
      for(var i = 0; i < itemList.length; i++) {
        writeAlert("You recieved " + itemList[i].name + " x" + itemList[i].amount);
      }
    }

    if(undefined !== currentStep.n) { //if the name of the current dialogue is not undefined...
      textName.innerText = currentStep.n; //...set the name parameter of the textbox as current name
    }
    if(undefined !== currentStep.m) { //if the "message" of the current dialogue is not undefined...
      textBox.innerText = currentStep.m; //...set the content parameter of the textbox as the current content

      //if this dialogue 1 has a "next" parameter, then a dialogue 2 has a "label" that corresponds with it.
      if(undefined !== currentStep.next) textSystem.currentLine = findLabel(currentStep.next); //so the dialogue 2 is found in the story
      else { //the dialogue 1 has no "next" parameter
        textSystem.currentLine++; //just go to the next dialogue in the story
      }
    } else if (undefined !== currentStep.question) { //the dialogue is not a "messasge", but a "question"
      if(textSystem.isQuestion === true) { //the isQuestion state has already been activated. change the text to the response to the player's answer
        textSystem.currentLine = findLabel(currentStep.answers[textSystem.option].next);
        currentStep = currentBranch[textSystem.currentLine];
        textBox.innerText = currentStep.m;
        if(undefined !== currentStep.n) {//if the name is not undefined...
          textName.innerText = currentStep.n; //...display it
        }
        //make the answer box disappear
        document.getElementById("answer-container").style.display = "none";
        for(var q = 0; q < answerBoxes.length - 1; q++) {
          answerBoxes[q].style.display = "none";
        }

        textSystem.isQuestion = false; //question process is over. set it to false now

      } else { //erm....it's a question but the variable has not been activated yet. set up the question so the player can respond
        textSystem.isQuestion = true;

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

//add event listener click function to answer buttons
for(var i = 0; i < answerBoxes.length - 1; i++) {
  answerBoxes[i].addEventListener("click", function() {
    if(textSystem.isQuestion === true) {
      textSystem.option = answerBoxes.indexOf(this);
      advanceText();
    }
  });
}

//}