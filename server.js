"use strict";

const finalhandler = require('finalhandler');
const bodyParser   = require('body-parser');
const http         = require('http');
const urlParser    = require('url');
const querystring  = require('querystring');
const Router       = require('router');
const bcrypt       = require('bcrypt');

const router = new Router({ mergerParams: true });

let messages = [];
let nextId = 1

class Message {
  constructor(message) {
    this.id = nextId;
    this.message = message;
    nextId++;
  }
}

router.use(bodyParser.json());

router.get('/', (request, response) => {
  response.setHeader('Content-Type', 'text/plain; charset=utf-8');
  response.end('Hello, World!');
});

router.get('/messages', (request, response) => {
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.end(JSON.stringify(messages));
});

router.get('/message/:id', (request, response) => {
  let url    = urlParser.parse(request.url),
    params = querystring.parse(url.query);

  const found = messages.find((message) => message.id == request.params.id);

  if (params.encrypt) {
    response.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return bcrypt.hash(result, 10, (error, hashed) => {
      response.end(hashed);
    });
  }
  response.setHeader('Content-Type', 'application/json; charset=utf-8');

  response.end(JSON.stringify(found));
});

router.post('/message', (request, response) => {
  let newMessage;

  response.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (!request.body.message) {
     response.statusCode = 400;
     response.statusMessage = 'No message provided.';
     response.end();
     return;
   }
  newMessage = new Message(request.body.message)
  messages.push(newMessage)

  response.end(JSON.stringify(newMessage.id));
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
