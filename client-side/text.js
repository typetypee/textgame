import {gameState} from "./main.js"

//TEXT SYSTEM {

const textBox = document.getElementById("text"), textName = document.getElementById("name"), answerBoxes = Array.prototype.slice.call(document.getElementsByClassName("answer"));

var textData = "";
var nameData = "";

var list; //the location of the current dialogue so we can send to server later
var textSystem = {
  currentLine: 1, //current line in text
  isQuestion: false, //determines whether the current line is a choice
  option: 0, //the choice selected
}

function retrieveBranch(key) { //unlike the runscene/runlevel, this is for retrieving text-specific info rather than visuals
  textSystem.currentLine = 0;
  textSystem.option = 0;
  return new Promise((resolve) => { //key is the name of the npc
    importJSON("../json/speech.json", currentScene, function(json) {
      resolve(json[key]);
    })
  })
}

function runAndSaveText(json, name) {
  textData = json; //where the advnaceText can access the current dialgue
  advanceText();
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

    //**FUNCTION LIST**//
    function endNode() {
      textSystem.currentLine = textData.length;
      advanceText(); //automaticaclly end
    }

    function checkInventory(message){
      for(var k = 0; k < message.checkInventory.length; k++) { //inventory check
        if(findIndex(playerInventory, "name", message.checkInventory[k]) === -1) {//check if item frpm checkInventory is present in playerInventory
          return false; //if even one item is missing, return false
        }
      }
      return true; //all items in inventory false
    }

    function removeInventory(message){
      for(var p = 0; p < message.removeInventory.length; p++) {
        removeFromInventory(message.removeInventory[p]);
      }
    }

    function questionSetup() {
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

    if (undefined !== currentStep.n) textName.innerText = currentStep.n; //...set the name parameter of the textbox as current name

    if (undefined !== currentStep.m) { //if the "message" of the current dialogue is not undefined...
      textBox.innerText = currentStep.m; //...set the content parameter of the textbox as the current content

      //if this dialogue 1 has a "next" parameter, then a dialogue 2 has a "label" that corresponds with it.
      if (undefined !== currentStep.next) {
        if(currentStep.next === "endNode") endNode();
        else if(currentStep.next === "markNodeDone") {
            markTrue(JSON.stringify(list), "marknodedone");
            textSystem.currentLine = textData.length;
        } else textSystem.currentLine = findLabel(currentStep.next); //so the dialogue 2 is found in the story
      } else { //the dialogue 1 has no "next" parameter
        textSystem.currentLine++; //just go to the next dialogue in the story
      }
    } else if (undefined !== currentStep.question) { //the dialogue is not a "messasge", but a "question"
      //okay okay so here the player has already answered?, cuz like, we're moving on from the question
      if (textSystem.isQuestion === true) { //the isQuestion state has already been activated. change the text to the response to the player's answer

        var chosenAnswer = currentStep.answers[textSystem.option];
        if(chosenAnswer.next === "endNode") endNode();
        else {
            if(chosenAnswer.removeInventory !== undefined) { removeInventory(chosenAnswer);
            }
            if(chosenAnswer.completeTrue !== undefined) { //marking certain state as true
              for(var q = 0; q < chosenAnswer.completeTrue.length; q++) {
                markTrue(JSON.stringify([currentScene, chosenAnswer.completeTrue[q]]), "markquestdone");
              }
            }

            textSystem.currentLine = findLabel(chosenAnswer.next); //find the next line
            currentStep = textData[textSystem.currentLine]; //set the current step to the next line

            textBox.innerText = currentStep.m; //set the text to the next line
            if (undefined !== currentStep.n) textName.innerText = currentStep.n; //display the name

            //make the answer box disappear
            document.getElementById("answer-container").style.display = "none";
            for (var q = 0; q < answerBoxes.length - 1; q++) {
              answerBoxes[q].style.display = "none";
            }

            textSystem.isQuestion = false; //question process is over. set it to false now
        }

      } else { //erm....it's a question but the variable has not been activated yet. set up the question so the player can respond
          //note that in this state, we do not move on to the next message, we remain on the question, all we have done is changed states
        //first..

          if(currentStep.checkInventory !== undefined) { //occurs when an item is required to say a certain thing. The question still plays, the answer choice is just unavailable.

            if(checkInventory(currentStep)) {
                textBox.innerText = currentStep.question;
                textSystem.currentLine = textData.length; //force the ending >:), but end it on the next click
                //even if even one item is missing from inventory, end the node
            } else questionSetup(); //the check has been passed
          } else questionSetup(); //set up question as normal

      }
    }
    if (undefined !== currentStep.complete && currentStep.complete !== "isLast") markTrue(JSON.stringify(list), "marknodedone");
  }

  else if (textSystem.currentLine === textData.length) { //basically means we are finished, and we're esentially reseting
    gameState = "interact"
    textData = "";
    textSystem.currentLine = 0;
    textSystem.isQuestion = false;
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

async function runText(npc) { //activates when an npc is clicked, different from advanceText, which runs when clicking during a dialogue sequence
  if (gameState === "interact") {

    var temp = await retrieveBranch(npc); //the dialogue for a specfic npc

    var theChosenOne; //the dialgue branch currently chosen for the npc's scene

    for (var i = 0; i < temp.length; i++) { //look through all the dialogue for the npc for the next one that is uncompleted

      var thing = temp[i] //the specific dialogue branch of the npc
      var completeThing = findIndex(thing, "complete", true); //find any messages that contain a complete marked as true, will come as -1 if there are none that are true
      //this function checks for a true rather than looking for falses because a certain dialogue section can have multiple choices due to branching dialogue
      var isLastCheck = findIndex(thing, "complete", "isLast");

      if (completeThing === -1) {
        theChosenOne = i;
        break; //end it because uncomplete has been found
      }
      else if (isLastCheck === "isLast") {
        theChosenOne = i; //no uncompletes. repeat the last dialogue
        break;
      }
    }

    list = [currentScene, npc, theChosenOne]

    runAndSaveText(temp[theChosenOne]); //read the comments in this function for info about it
    gameState = "text";
  }
  else {
    retrieveBranch(branch);
    gameState = "text";
  }
}

//}

//EVENT LISTENERS FOR TEXT
window.addEventListener("keydown", function(e){ //if a key was pressed
  e.preventDefault();

  if(e.keyCode === 32 && gameState === "text") advanceText();

})

window.addEventListener("click", function(e) {
  if(textSystem.isQuestion === false && gameState === "text") {
    if(textSystem.currentLine !== 0) advanceText();
  }

})
