"use strict";

const http         = require('http');
const finalhandler = require('finalhandler');
const Router       = require('router');
const bodyParser   = require('body-parser')
const urlParser    = require('url')
const querystring  = require('querystring');
const bcrypt       = require('bcrypt-nodejs')

const router = new Router({ mergeParams: true });
router.use(bodyParser.json())

let messages = []
let id = 1

class Message {
  constructor(message) {
    this.id = id
    id++
    this.message = message
  }
}

router.get('/', (request, response) => {
  response.setHeader('Content-Type', 'text/plain; charset=utf-8')
  response.end("Hello, World!");
});

router.get('/messages', (request, response) => {
  response.setHeader("Content-Type", "application/json; charset=utf-8")
  response.end(JSON.stringify(messages));
});

router.get('/message/:id', (request, response) => {

  let url = urlParser.parse(request.url),
  params = querystring.parse(url.query);

  const messageID = request.params.id

  const foundMessage = messages.find(message => message.id == messageID)
  response.setHeader("Content-Type", "application/json; charset=utf-8")

  if (!foundMessage) {
    response.statusCode = 400
    response.statusMessage = "No message found"
    response.end()
    return
  }

  const result = JSON.stringify(foundMessage)

  if (params['encrypt']) {
    response.setHeader("Content-Type", "text/plain; charset=utf-8")
    let hash = bcrypt.hashSync(result)
    console.log(hash);

    return response.end(hash)
  }

  response.end(result);
})

router.post('/message', (request, response) => {
  let newMessage

  if (!request.body.message) {
    response.statusCode = 400
    response.statusMessage = "No message sent"
    response.end()
    return
  }

  newMessage = new Message(request.body.message)

  messages.push(newMessage)
  response.setHeader("Content-Type", "application/json; charset=utf-8")
  response.end(JSON.stringify(newMessage.id));
})

const server = http.createServer((request, response) => {
  router(request, response, finalhandler(request, response));
});

exports.listen = function(port, callback) {
  server.listen(port, callback);
};

exports.close = function(callback) {
  server.close(callback);
};
