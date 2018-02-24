"use strict";

const http         = require('http');
const finalhandler = require('finalhandler');
const Router       = require('router');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const saltRounds = 10;

let messages = [];

const router = new Router({ mergeParams: true });

router.use(bodyParser.json());

class Message{
  constructor(incomingMessage) {
    this.id = messages.length + 1;
    this.message = incomingMessage.message;
    messages.push(this);
  }
}

router.get('/', (request, response) => {
  response.setHeader('Content-Type', 'text/plain; charset=utf-8')
  response.end('Hello, World!');
});

router.post('/message', (request, response) => {
  // Save the message and send the message id back to the client.
  let newMessage = new Message(request.body, messages);

  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.end(`${messages[messages.length - 1].id}`);
})


router.get('/messages', (request, response) => {
  const messagesJSON = JSON.stringify(messages)
  console.log(messagesJSON)

  if (request.url.includes("?encrypt=true")) {
    response.setHeader('Content-Type', 'text/plain; charset=utf-8');

    bcrypt.hash(messagesJSON, saltRounds, (err, hashed) => {
      console.log(hashed)      
      response.end(hashed);
    });
  };

  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.end(messagesJSON);
});

router.get('/message/:id', (request, response) => {
  const message = messages[request.params.id - 1];
  const messageJSON = JSON.stringify(message);

  if (request.url.includes("?encrypt=true")) {
    console.log("setting text/plain")
    response.setHeader('Content-Type', 'text/plain; charset=utf-8');

    bcrypt.hash(messageJSON, saltRounds, (err, hashed) => {
      console.log(hashed)
      response.end(hashed);
    });
  };

  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.end(messageJSON);
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
