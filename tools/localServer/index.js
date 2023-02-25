const http = require('http');
const express = require('express');
const open = require('open')

const port = 3000;
const app = express();

app.use(express.json());
app.use(express.static("express"));
app.use(express.static('./'));
app.use('/', function(req,res){
  res.sendFile('./index.html', { root: './' });
});

const server = http.createServer(app);

server.listen(port);
console.debug('Server running on port ' + port);
console.debug('Opening browser for on port ' + port);
open('http://localhost:3000')
