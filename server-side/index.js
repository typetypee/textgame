
const express = require('express'),
      app = express(),
      bodyParser = require("body-parser"),
      cors = require("cors"),
       fs = require('fs');

app.use(cors());
app.use(express.static(__dirname + "/client-side"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.post("/marknodedone", function(req, res, err) {
 //if(err) return res.status(500).send(err);

  res.send("Data was received!");
  console.log("Working!");
  changeData(req.body, "../json/speech.json");
  res.end();
})

function changeData(list, fileName) { //by change data i mean change the json text file :)
  var temp;
  const data = fs.readFileSync(fileName, "utf-8");

  temp = JSON.parse(data);


  if(list.length == 2) {
      temp[list[0]][list[1]] = true;
  }
  else {
    //list goes like [character, currentScene, theChosenOne]
    //the character name, the name of the currentScene, and the current dialouge node chosen from said character and scene
    var theChosenOne = temp[list[0]][list[1]][list[2]];
    theChosenOne[theChosenOne.length-1].complete = true;
  }

  fs.writeFileSync(fileName, JSON.stringify(temp, null, "\t"));
  console.log("Edited!");


}

app.post("/markquestdone", function(req, res, err){
  res.send("Data was recieved! I think...");
  console.log("Working! I think...");
  changeData(req.body, "../json/states.json");
  res.end();

})


app.listen(3000, function(){
  console.log("Server is running on port: 3000")
});




/**
const
var infoo;


var data = fs.readFileSync("json/test-speech.json", {encoding: "utf-8", flag: "r+"});

console.log(data);
**/

/**
fs.writeFileSync("json/test-speech.json", infoo, {flag: 'r+'}, function(err) {
  if (err) throw err;
  console.log(":O");
})
  **/
