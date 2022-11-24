//TEXT SYSTEM {
var images = [];
function findLabel(label) {
    var index = findIndex(currentBranch, "label", label);
    return currentBranch.indexOf(currentBranch[index]);
}

function setImagePosition(given, element) {//set the position of an element, given coordinates, and then the element to be moved
  /**ADJUST THE CHARACTER X**/
    if(undefined !== given.x) {
/**PREDEFINED POSITIONS**/
      if(given.x === "left") element.style.left = "0px";
      else if (given.x === "right") element.style.right = "0px";
      else if (given.x === "center") element.style.left = gameWindow.offsetWidth*0.5-(element.offsetWidth*0.5);
/**CUSTOM POSITION**/
      else element.style.left = calcCoord("width", char.x) + "px";
    }
  /**ADJUST THE CHARACTER Y**/
    if(undefined !== given.y) {
/**PREDEFINED POSITIONS**/
      if(given.y === "top") element.style.top = "0px";
      else if (given.y === "bottom") element.style.bottom = "0px";
      else if (given.y === "center") element.style.top = gameWindow.offsetHeight*0.5-(element.offsetHeight*0.5);
/**CUSTOM POSITION**/
      else element.style.top = given.y + "px";
    }
}

function advanceText() {
  var currentStep = currentBranch[textSystem.currentLine]; //the current line being displayed in the story

  if(textSystem.currentLine < currentBranch.length) { //if the story is not over yet
/**IMAGE DISPLAYING**/
    if(undefined !== currentStep.createImg) { //this step specifies images to be created
      if(undefined!== currentStep.createImg.bg) { //display background
        gameWindow.style.backgroundImage = "url(" + currentStep.createImg.bg + ")";
      }
    /**DISPLAY CHARACTERS**/
      if(undefined !== currentStep.createImg.char) {
        for(var i = 0; i < currentStep.createImg.char.length; i++) {
          var char = currentStep.createImg.char[i];
          var image = document.createElement("img");
          image.src = char.url;
          setImagePosition(char, image);
          image.classList.add("character");
          char.element = image;
          gameWindow.appendChild(image);
          images.push(char);

        }
      }
    }
/**ADJUST THE CHARACTER POSITION**/
  if(undefined !== currentStep.moveImg) {
    if(undefined !== currentStep.moveImg.char) {
      for(var i = 0; i < currentStep.moveImg.char.length; i++) {
        var imgToMove = currentStep.moveImg.char[i];
        var imgInArrIndex = findIndex(currentStep.moveImg.char, "name", imgToMove.name);
        var imgInArr = images[imgInArrIndex];
        imgInArr.x = imgToMove.x;
        imgInArr.y = imgToMove.y;
        setImagePosition(imgInArr, imgInArr.element);

      }
    }
  }
/**IMAGE REMOVAL**/
  if(undefined !== currentStep.removeImg) { //this step specifies images to be removed
  /**REMOVE CHARACTERS**/
    if(undefined !== currentStep.removeImg.char) {
      for(var i = 0; i < currentStep.removeImg.char.length; i++) {
        var imgToRemove = currentStep.removeImg.char[i]; //find the image to be removed in the JSON
        var imgInArrIndex = findIndex(currentStep.removeImg.char, "name", imgToRemove.name); //find the image to be removed in the image array, gotta find the index first
        var imgInArr = images[imgInArrIndex]; //this is the image we gotta remove identified in the images array
      //remove the element from html and remove it from images array
        gameWindow.removeChild(imgInArr.element);
        images.splice(imgInArrIndex, 1);
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
