var http = require('http');

const server = http.createServer(function(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end('Hello World!');
})

server.listen(3000);


const fs = require('fs');
var infoo;

var data = fs.readFileSync("json/test-speech.json", {encoding: "utf-8", flag: "r+"});

console.log(data);


/**  
fs.writeFileSync("json/test-speech.json", infoo, {flag: 'r+'}, function(err) {
  if (err) throw err;
  console.log(":O");
})
  **/