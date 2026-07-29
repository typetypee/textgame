import { allBodies, tileSize, saveData } from "./main.js"
import { touchingWho } from "./grid.js"
import { importFile, findIndex, markTrue, createSaveDataKey } from "./function-storage.js"
import { lookInPlace } from "./inventory.js"
import { convertReedableToJSON } from "./reedable.js"
import { checkAndSwitchScene } from "./scene-switch.js"

//this file contains the code for the text system of the game

//TEXT SYSTEM {

const textBox = document.getElementById("text"), textName = document.getElementById("name"), answerBoxes = Array.prototype.slice.call(document.getElementsByClassName("answer"));

var textData = ""; //stores the dialgoue data for the current scene
var nameData = "";

var list; //the location of the current dialogue so we can send to server later
var textSystem = {
  currentLine: 1, //current line in text, i think the 1 is arbitrary here...
  isQuestion: false, //determines whether the current line is a choice
  option: 0, //the choice selected
  currentActor: "",
  currentNode: ""
}

function retrieveBranch(key) { //unlike the runscene/runlevel, this is for retrieving text-specific info rather than visuals
  textSystem.currentLine = 0;
  textSystem.option = 0;
  return new Promise((resolve) => { //"key" is the name of the actor
    importFile("../reedable/script.txt", function(data) {
      //process the data
      let json = convertReedableToJSON(data);
      let specificJSON = json[currentTextScene][key];
      resolve(specificJSON);
    })
  })
}

function retrieveSaveData() {
  return new Promise((resolve) => {
    importFile("../storage/save.json", function(data){
    let json = JSON.parse(data);
    resolve(json);
    })
  }) 
}

//this function saves the currentnode to the textdata variable (which is the text the textengine can acesss), and then will begin running the textengine
function runAndSaveText(json, name) { //text data will be the specific node
  textData = json; //where the advanceText can access the current dialgue
  advanceText();
}

//will find the message with the corresponding label and return the index of it
function findLabel(label) {
  var index = findIndex(textData, "label", label);
  return textData.indexOf(textData[index]);
}

function recieveItem(currentStep){
  //**playerData.sprite RECIVES ITEM**//
  //i must recontemplate this .receiveItem event...
  if (undefined !== currentStep.recieveItem) {
    var itemList = currentStep.recieveItem.items
    addToInventory(itemList);
    for (var i = 0; i < itemList.length; i++) {
      writeAlert("You recieved " + itemList[i].name + " x" + itemList[i].amount);
    }
  }
}

//**FUNCTION LIST**//
//used to end the interaction automatically
function endNode() {
  textSystem.currentLine = textData.length;
  advanceText(); //automaticaclly end
}
//i don't even remember what this is for
function checkInventory(message) {
  for (var k = 0; k < message.checkInventory.length; k++) { //inventory check
    if (findIndex(playerData.spriteInventory, "name", message.checkInventory[k]) === -1) {//check if item frpm checkInventory is present in playerData.spriteInventory
      return false; //if even one item is missing, return false
    }
  }
  return true; //all items in inventory false
}

//for setting up a question
function questionSetup(currentStep) {
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

function removeInventory(message) {
      for (var p = 0; p < message.removeInventory.length; p++) {
        removeFromInventory(message.removeInventory[p]);
      }
    }

//this function is usually triggered by a keypress, it advances text along
function advanceText() {

  var currentStep = textData[textSystem.currentLine]; //the current line being displayed in the story

  if (textSystem.currentLine < textData.length) { //if the story is not over yet


    if (undefined !== currentStep.n) { //...set the name parameter of the textbox as current name
      if (currentStep.n === "noName") textName.style.display = "none"
      else {
        textName.innerText = currentStep.n;
        textName.style.display = "block";
      }
    }

    if (undefined !== currentStep.m) { //if the "message" of the current dialogue is not undefined...
      textBox.innerText = currentStep.m; //...set the content parameter of the textbox as the current content
      //if this dialogue 1 has a "next" parameter, then a dialogue 2 has a "label" that corresponds with it.
      if (undefined !== currentStep.event) {
        console.log(currentStep.event)
        eval(currentStep.event);
      }
      if (undefined !== currentStep.next) {
        if (currentStep.next === "endNode") textSystem.currentLine = textData.length;
        else textSystem.currentLine = findLabel(currentStep.next); //so the dialogue 2 is found in the story
      } else { //if the dialogue 1 has no "next" parameter
        textSystem.currentLine++; //just go to the next dialogue in the story
      }
    } else if (undefined !== currentStep.question) { //the dialogue is not a "messasge", but a "question"
      //okay okay so here the playerData.sprite has already answered?, cuz like, we're moving on from the question
      if (textSystem.isQuestion === true) { //the isQuestion state has already been activated. change the text to the response to the playerData.sprite's answer
        var chosenAnswer = currentStep.answers[textSystem.option];
        //trigger the event associated with the answer choice
        if (undefined !== chosenAnswer.event) {
          eval(chosenAnswer.event);
        }

        if (chosenAnswer.next === "endNode") endNode(); //this is only really for item interactions
        else {//if the answer choice does not automatically end the node, occurs most of the time in character interactions
          //this must be edited to fit the new system, but i am not yet working on the quest system, so this can wait
          if (chosenAnswer.removeInventory !== undefined) {
            removeInventory(chosenAnswer);
          }
          if (chosenAnswer.completeTrue !== undefined) { //marking certain state as true
            for (var q = 0; q < chosenAnswer.completeTrue.length; q++) {
              markTrue(JSON.stringify([currentTextScene, chosenAnswer.completeTrue[q]]), "markquestdone");
            }
          }

          textSystem.currentLine = findLabel(chosenAnswer.next); //find the next line
          currentStep = textData[textSystem.currentLine]; //set the current step to the next line
          
          //make the answer box disappear
          document.getElementById("answer-container").style.display = "none";
          for (var q = 0; q < answerBoxes.length - 1; q++) {
            answerBoxes[q].style.display = "none";
          }
          advanceText(); //now display the message!
          textSystem.isQuestion = false; //question process is over. set it to false now
        }

      } else { //erm....it's a question but the variable has not been activated yet. set up the question so the playerData.sprite can respond
        //note that in this state, we do not move on to the next message, we remain on the question, all we have done is changed states
        //first..

        //the mechanics of this must also be contemplated
        if (currentStep.checkInventory !== undefined) { //occurs when an item is required to say a certain thing. The question still plays, the answer choice is just unavailable.
          //i think this is for when you want to give an item to someone for a quest, and you give it by pressing a certain answer choice
          if (checkInventory(currentStep)) {
            textBox.innerText = currentStep.question;
            textSystem.currentLine = textData.length; //force the ending >:), but end it on the next click
            //even if even one item is missing from inventory, end the node
          } else questionSetup(currentStep); //the check has been passed
        } else questionSetup(currentStep); //set up question as normal

      }
    }
  }
  else if (textSystem.currentLine === textData.length) { //basically means we are finished, and we're esentially reseting
    saveData[currentTextScene][textSystem.currentActor][textSystem.currentNode] = true;
    document.getElementById("answer-container").style.display = "none";
    for (var q = 0; q < answerBoxes.length - 1; q++) {
      answerBoxes[q].style.display = "none";
    }
    gameState = "interact"
    textData = "";
    textSystem.currentLine = 0;
    textSystem.isQuestion = false;
  }

}

//add the click event listener to answer buttons
for (var i = 0; i < answerBoxes.length - 1; i++) {
  answerBoxes[i].addEventListener("click", function(e) {
    if(textSystem.isQuestion === true) {
      textSystem.option = answerBoxes.indexOf(this);
      advanceText();
    }
    e.stopPropagation();
  });
}

async function intialRunText(actor) { //activates when an npc is clicked, different from advanceText, which runs when clicking during a dialogue sequence
  if (gameState === "interact") {
    let actorData = await retrieveBranch(actor); //get the branch for this specified actor
    function createNewKey(){
      //write this new key to the save data
      saveData[currentTextScene] = {};
      saveData[currentTextScene][actor] = [];
      //generate the save keys for each node
      for(let i = 0; i < actorData.length; i++) {
        saveData[currentTextScene][actor].push(false); //the key "actor" is an array containing true or false statements, representing if the node has been completed or not
      }
    }

    //check the save data if the save key even exists...
    if(saveData[currentTextScene] !== undefined) { //is it the scene even in the save data?
      if(saveData[currentTextScene][actor] !== undefined) {//is the npc even in the save data
        //nothing happens lmao
      } else { 
        createNewKey();
      }
    } else { //we need to write this new scene if it doesn't even exist, this means it is our first time talking in this scene
      //scene initilzation might need to be revised, hence this code will need to be revised, but for now it works...
      //write this key to the save data of the currentscene and actor
      createNewKey();
    }

    let currentNode; //the node currently chosen for the npc's scene

    for (var i = 0; i < saveData[currentTextScene][actor].length; i++) { //look through all the dialogue for the npc for the next one that is uncompleted
      if(saveData[currentTextScene][actor][i] == false) {
        currentNode = i;
        break;
      }
      else if(i == saveData[currentTextScene][actor].length - 1) { //if all the nodes are marked complete, then just repeat the last node
        currentNode = i;
      }
    }
    textSystem.currentNode = currentNode;
    textSystem.currentActor = actor;
    runAndSaveText(actorData[currentNode]); //read the comments in this function for info about it
    gameState = "text";
  }
  else {
    //i have no idea what this even does
    retrieveBranch(branch);
    gameState = "text";
  }
}

function changeState() { }

//}

//EVENT LISTENERS FOR TEXT
window.addEventListener("keydown", function(e) { //if a key was pressed
  e.preventDefault();
  if (e.keyCode === 32) {

    if (gameState === "interact") {
      //interacting with a sprite?
      var tempBodies = window.globalAllEntities;
      var spriteIndex = findIndex(tempBodies, "label", playerData.sprite.name);
      if (spriteIndex !== -1) tempBodies.splice(spriteIndex, 1);

      let name;
      for (let i = 0; i < tempBodies.length; i++) {
        name = touchingWho(tempBodies[i], playerData.sprite.position.x / tileSize, playerData.sprite.position.y / tileSize);
        if (name !== false) break;
      }
      if (name !== false) intialRunText(name);

      //or interacting with an object
      var getInteractLayer = currentTilemap.objects[0].objects;
      let interactWho;
      for (let k = 0; k < currentTilemap.objects[0].objects.length; k++) {
        interactWho = touchingWho(getInteractLayer[k], playerData.sprite.position.x / tileSize, playerData.sprite.position.y / tileSize);
        if (interactWho !== false) break;
      }
      if (interactWho !== false) intialRunText(interactWho);
    }
    else if (gameState === "text") advanceText();
  }

  if(e.keyCode === 83) {
    console.log(saveData);
  }
  if(e.keyCode === 68) {
    console.log(textData);
  }

  //if(e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40) checkAndSwitchScene();

})

window.addEventListener("click", function(e) {
  if (textSystem.isQuestion === false && gameState === "text") {
    if (textSystem.currentLine !== 0) advanceText();
  }
  e.stopPropagation();
})
