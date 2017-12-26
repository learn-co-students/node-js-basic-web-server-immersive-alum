"use strict";

const http         = require('http');
const finalhandler = require('finalhandler');
const Router       = require('router');
const bodyParser   = require('body-parser');
const urlParser    = require('url')
const bcrypt       = require('bcrypt')

const router = new Router({ mergeParams: true });

router.use(bodyParser.json())

var messages = [{ id: 1, message: 'asdfasfasdf' }];

class Message {
  constructor(message) {
    this.id = newId
    this.message = message
    newId++
  }
}

router.get('/', (request, response) => {
  response.setHeader('Content-Type', 'text/plain; charset=utf-8');
  response.end("Hello World!");
});

router.post('/message', (req, res) => {
  let message = new Message(req.body.message)
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  messages.push(message)
  res.end(JSON.stringify(message.id))
});

router.get('/messages', (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(messages))
})

router.get('/message/:id', (req, res) => {
  let url = urlParser.parse(req.url), id = url.href.split("/")[2]
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  let message = messages.find(m => m.id == id)
  res.end(JSON.stringify(message))
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
