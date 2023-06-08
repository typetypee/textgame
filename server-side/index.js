
const express = require('express'),
      app = express(),
      bodyParser = require("body-parser"),
      cors = require("cors"),
       fs = require('fs');

app.use(cors());
app.use(express.static(__dirname + "/client-side"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.post("/oogabooga", function(req, res, err) {
 //if(err) return res.status(500).send(err);

  res.send("Data was received!");
  console.log("Working!");
  changeData(req.body, "../json/test-speech.json");
  res.end();
})

app.listen(3000, function(){
  console.log("Server is running on port: 3000")
});

function changeData(list, fileName) {
  var temp;
  fs.readFileSync(fileName, "utf-8", function (err, data, res) {
    temp = data;
    console.log(data);
      temp[list[0]][list[1]][list[2]].complete = true;
  })

  /**fs.writeFileSync(fileName, temp, function(err){
    console.log("Edited!");
  })**/
}


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
