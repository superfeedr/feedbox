var Path = require('path');
var Hapi = require('hapi');
var Basic = require('hapi-auth-basic');
var Logging = require('good');
var Console = require('good-console');
var superfeedr = require(__dirname + '/lib/superfeedr.js');



var server = new Hapi.Server({
  connections: {
    routes: {
      files: {
        relativeTo: Path.join(__dirname, 'public')
      }
    }
  }
});

server.connection({ 
  host: 'localhost', 
  port: process.env.PORT || 8000 
});



server.register(Basic, function (err) {
  server.auth.strategy('simple', 'basic', { 
    validateFunc: function(username, password, callback) {
      superfeedr.authenticate(username, password, function(error) {
        if(error)
          return callback(null, false, {});          

        return callback(null, true, {name: username});         
      });
    } 
  });
});

server.register({
  register: Logging,
  options: { 
    opsInterval: 1000,
    reporters: [{
      reporter: Console,
      events: { log: '*', response: '*' }
    }]
  }
}, function (err) {
  if (err) {
    console.error(err);
  }
});

server.route({
  method: 'GET',
  path:'/', 
  handler: function (request, reply) {
    reply.file('index.html');    
  }
});

server.route({
  method: 'GET',
  path:'/feedbox.js', 
  handler: function (request, reply) {
    reply.file('feedbox.js');    
  }
});

server.route({
  method: 'POST',
  path:'/subscribe', 
  config: {
    auth: 'simple',
    handler: function (request, reply) {
      superfeedr.subscribe(request.payload['hub.topic'], function(err, data) {
        if(!err)
          return reply('Thank you! ' + request.payload['hub.topic'] + ' has been added to Superfeedr\'s set of feeds.\n');

        console.error('Failed to add ' + request.payload['hub.topic'] + ' ' + err);
        return reply('We could not add ' + request.payload['hub.topic']);
      });
    }
  }
});



// Start the server
server.start();