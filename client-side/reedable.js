export function convertReedableToJSON(text){
    let lines = text.split("\n");
    let finalJSON = {};
    let currentScene = "";
    let currentActor = ""; //the npc/interactable dialogue will be grouped under
    let currentNode = "";

    //states
    let lastLineWasQuestion = false;

    for(let i = 0; i < lines.length; i++) {
        let cleanLine = lines[i].trim(); //remove white space before and after the line
        //ignore if it is a blank line
        if(cleanLine == "") continue;
        //scene label, is an object {} filled with actors
        else if(cleanLine.startsWith("$")) {
            let sceneName = cleanLine.slice(1).trim(); //get the name of the scene, get everything aftter the $ sign, trim again for extra measures
            finalJSON[sceneName] = {};
            currentScene = sceneName;
            currentActor = ""; //if a new scene is being defined, there's probably not any actors or nodes defined yet
            currentNode = "";
        }
        //current actor label, is an array [] filled with nodes for this actor
        else if(cleanLine.startsWith("[")) {
            //current scene cannot be undefined
            if(currentScene == "") {
                throw("No scene defined for this actor at Line " + (i + 1) + ".")
            }
            else {
                let name = cleanLine.slice(1, -1);
                finalJSON[currentScene][name] = [];
                currentActor = name;
                currentNode = ""; //if a new actor is being defined, there's probably not any nodes defined yet
            }
        }
        //defines a text node within an actor, is an array [] filled with messages
        else if (cleanLine.startsWith("________")) {
            let currentActorElement = finalJSON[currentScene][currentActor];
            currentActorElement.push([]);
            currentNode = currentActorElement[currentActorElement.length-1];
        }
        //MOVING INTO MESSAGE DEFINITIONS, the messages within a node
        else {
            if(currentScene == "") {
                throw("No scene defined for this message at Line " + (i + 1) + ".");
            }
            else if(currentActor == "") {
                throw("No actor defined for this message at Line " + (i + 1) + ".");
            }
            else if(currentNode === "") {
                throw("No node defined for this message at Line " + (i + 1) + ".");
            }
            else {
                //is an answer to a question
                if(lastLineWasQuestion || cleanLine.startsWith("-")) { //if the last line was a question, it is expected there will be answers following. the secondary statement matters if the last line was an answer for example
                    let afterMessage = cleanLine.split("\"")[2]; //the stuff after the message
                    let currentElement = ""; //the actual json of the current answer in the question
                    
                    if(!cleanLine.startsWith("-")) {
                        throw("Line " + (i + 1) + ", a question must have answers.");
                    }
                    else if(!afterMessage.includes(">")) {
                        throw("Line " + (i + 1) + ", an answer must include a \"next\" label.");
                    } else {
                        let message = cleanLine.match(/"([^"]*)"/)?.[1];
                        let nextLabel = afterMessage.split(">")[1].trim();

                        let questionElement = currentNode[currentNode.length - 1] //the question we need to add answers to will be the most recently added message to the actor
                        questionElement.answers.push({"m": message, "next": nextLabel})
                        currentElement = questionElement.answers[questionElement.answers.length-1];
                        lastLineWasQuestion = false;

                        //now deal with the aftermessage flags...
                        let nextIndex = "";
                        let eventIndex = "";
                        let allIndexes = [];

                        //search for the indexes
                        if(afterMessage.includes(">")) { //next indicator
                            nextIndex = afterMessage.indexOf(">");
                            allIndexes.push(nextIndex);
                        }
                        if(afterMessage.includes("!")) {
                            eventIndex = afterMessage.indexOf("!");
                            allIndexes.push(eventIndex);
                        
                        }
                        
                        //now actually derive the text from the strings given the indexes
                        if(afterMessage.includes(">")) { //next indicator
                            let nextFlagPos = allIndexes.find(index => index > nextIndex);
                            currentElement.next = afterMessage.slice(nextIndex + 1, nextFlagPos).trim();
                        }
                        if(afterMessage.includes("!")) { 
                            let nextFlagPos = allIndexes.find(index => index > eventIndex);
                            currentElement.event = afterMessage.slice(eventIndex + 1, nextFlagPos).trim();
                        }
                    }
                }
                //is a question
                else if(cleanLine.startsWith("?")) {
                    let message = cleanLine.match(/"([^"]*)"/)?.[1]; //get the content of the question
                    let afterMessage = cleanLine.split("\"")[2]; //the stuff after the message

                    let currentElement = "";

                    if(afterMessage.includes(">")) {
                        throw("Line " + (i + 1) + ", a question cannot have a \"next\" label.");
                    }
                    else { 
                        currentNode.push({"question": message, "answers": []});
                        lastLineWasQuestion = true;
                        currentElement = currentNode[currentNode.length-1];
                    }
                    //now deal with the aftermessage flags...
                    let labelIndex = "";
                    let eventIndex = "";
                    let allIndexes = [];

                    //search for the indexes
                    if(afterMessage.includes("@")) { //label indicator
                        labelIndex = afterMessage.indexOf("@");
                        allIndexes.push(labelIndex);
                    }
                    if(afterMessage.includes("!")) {
                        eventIndex = afterMessage.indexOf("!");
                        allIndexes.push(eventIndex);
                    
                    }
                    
                    //now actually derive the text from the strings given the indexes
                    if(afterMessage.includes("@")) { //label indicator
                        let nextFlagPos = allIndexes.find(index => index > labelIndex);
                        currentElement.label = afterMessage.slice(labelIndex + 1, nextFlagPos).trim();
                    }
                    if(afterMessage.includes("!")) { 
                        let nextFlagPos = allIndexes.find(index => index > eventIndex);
                        currentElement.event = afterMessage.slice(eventIndex + 1, nextFlagPos).trim();
                    }

                    //the name definition
                    if(cleanLine.includes(":")) {
                        let beforeMessage = cleanLine.split("\"")[0].trim();
                        if(beforeMessage.includes(":")) {
                            currentElement.n = beforeMessage.split(":")[0].slice(1).trim(); //the slice is so the question mark is excluded
                        } //will check a for a colon before the message
                                
                    }
                }
                //is a message, has no special symbol
                else {
                    let message = cleanLine.match(/"([^"]*)"/)?.[1]; //get the content of the message
                    let afterMessage = cleanLine.split("\"")[2]; //the stuff after the message


                    currentNode.push({"m": message})
                    let currentElement = currentNode[currentNode.length-1];

                    //now deal with the aftermessage flags...
                    let labelIndex = "";
                    let nextIndex = "";
                    let eventIndex = "";
                    let allIndexes = [];

                    //search for the indexes
                    if(afterMessage.includes("@")) { //label indicator
                        labelIndex = afterMessage.indexOf("@");
                        allIndexes.push(labelIndex);
                    }
                    if(afterMessage.includes(">")) { //next indicator
                        nextIndex = afterMessage.indexOf(">");
                        allIndexes.push(nextIndex);
                    }
                    if(afterMessage.includes("!")) {
                        eventIndex = afterMessage.indexOf("!");
                        allIndexes.push(eventIndex);
                    
                    }
                    
                    //now actually derive the text from the strings given the indexes
                    if(afterMessage.includes("@")) { //label indicator
                        let nextFlagPos = allIndexes.find(index => index > labelIndex);
                        currentElement.label = afterMessage.slice(labelIndex + 1, nextFlagPos).trim();
                    }
                    if(afterMessage.includes(">")) { //next indicator
                        let nextFlagPos = allIndexes.find(index => index > nextIndex);
                        currentElement.next = afterMessage.slice(nextIndex + 1, nextFlagPos).trim();
                    }
                    if(afterMessage.includes("!")) { 
                        let nextFlagPos = allIndexes.find(index => index > eventIndex);
                        currentElement.event = afterMessage.slice(eventIndex + 1, nextFlagPos).trim();
                    }
                    
                    //the name definition
                    if(cleanLine.includes(":")) {
                        let beforeMessage = cleanLine.split("\"")[0];
                        if(beforeMessage.includes(":")) {
                            let ccurrentElement = currentNode[currentNode.length-1];
                            currentElement.n = beforeMessage.split(":")[0];
                        } //will check a for a colon before the message
                                
                    }
                }
            }
        }
    }
    return finalJSON; 
}
