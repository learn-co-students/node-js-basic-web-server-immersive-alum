"use strict";

const http         = require('http');
const finalhandler = require('finalhandler');
const Router       = require('router');

const router = new Router();//instantiates router

//added:
const bodyParser = require('body-parser');
router.use(bodyParser.json());

const bcrypt = require('bcrypt');

//responds with "Hello, World!"
router.get('/', (request, response) => {

  response.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
  response.write("Hello, World!");
  response.end();

});


//added: Save message & send message id back to the client
let messages = [];
router.post('/message', (request, response) => {

  messages.push({id: 1, message: request.body.message});

  response.writeHead(200, {'Content-Type': "application/json; charset=utf-8"});

  let json = JSON.stringify({id: messages.length});
  response.end(json);

});

//added: returs list of messages
router.get('/messages', (request, response) => {

  response.writeHead(200, {'Content-Type': "application/json; charset=utf-8"});

  let json = JSON.stringify({messages: messages});
  response.end(json);

});

//added: returns the message matching the id
router.get('/message/:id', (request, response) => {

  let id = request.params.id;
  let message = messages[id - 1];

  let json;
  let hashedMessage;

  if (request.originalUrl === `/message/${id}`) {
    response.writeHead(200, {'Content-Type': "application/json; charset=utf-8"});
    json = JSON.stringify({message: message});
    response.end(json);
  } else{
    response.writeHead(200, {'Content-Type': "text/plain; charset=utf-8"});
    json = JSON.stringify(message);
    hashedMessage = bcrypt.hashSync(json, 10);
    response.end(hashedMessage);
  }
});

const server = http.createServer((request, response) => {
  router(request, response, finalhandler(request, response));
});

exports.listen = function(port, callback) {
  server.listen(port, callback);
};

exports.close = function(callback) {
  server.close(callback);
};
