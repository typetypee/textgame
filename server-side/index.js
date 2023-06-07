
const express = require('express');

const app = express();

app.use(express.static("../client-side"));

app.all("/oogabooga", function(req, res){
  res.header("Access-Control-Allow-Origin", "*");
})

app.post("/oogabooga", function(req, res) {
  if(err) return res.status(500).send(err);
  res.send(req.body.name + " was received!");
  console.log("Working");
})

app.listen(3000, function(){
  console.log(`Server is running on port: ${3000}`)
});



/**
const fs = require('fs');
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
