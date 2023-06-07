//var http = require('http');

const express = require('express');

const app = express();

app.use(express.static(__dirname + "/client-side"));

app.post("/exportJSON", function(req, res) {
  res.send(req.body.name + " was received!");
})

app.listen(3000);



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