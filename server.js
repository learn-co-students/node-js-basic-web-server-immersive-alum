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
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.end(JSON.stringify(messages));
});

router.get('/message/:id', (request, response) => {
  let message;
  try {
    message = messages[request.params.id - 1];  
  } catch(err) {
    response.end(err);
  }

  
  const messageJSON = JSON.stringify(message);

  if (request.url.includes("encrypt=true")) {

    response.setHeader('Content-Type', 'text/plain; charset=utf-8');

    bcrypt.hash(messageJSON, saltRounds, function(err, hashed) {
      response.end(hashed);
    })

  } else if (!request.url.includes("encrypt=true")){
    response.setHeader('Content-Type', 'application/json; charset=utf-8');
    response.end(messageJSON);
  } 
});

// router.get('/message/:id?encrypt=true', (request, response) => {
//   console.log("HIT");
//   console.log(request.params)
//   let messageToEncrypt = messages.find(item => {
//     return item.id == request.params.id
//   });

//   let sendThis = bcrypt.hash(messageToEncrypt, 10, function(err, hash) {
//     console.log(err)
//     console.log(hash)
//     return hash
//   })();

//   response.setHeader('Content-Type', 'text/plain; charset=utf-8');
//   response.end(JSON.stringify(sendThis));
// });

const server = http.createServer((request, response) => {
  router(request, response, finalhandler(request, response));
});

exports.listen = function(port, callback) {
  server.listen(port, callback);
};

exports.close = function(callback) {
  server.close(callback);
};
