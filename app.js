const restify = require('restify');
const builder = require('botbuilder');

// Restify Server
const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url);
});

const connector = new builder.ChatConnector({
  appId: process.env.MicrosoftAppId,
  appPassword: process.env.MicrosoftAppPassword
});

server.post('/api/messages', connector.listen());

// data storage, just for development
const inMemoryStorage = new builder.MemoryBotStorage();

const bot = new builder.UniversalBot(connector, [
  function(session){
    session.beginDialog('greetings:/');
  },
  /*function(session){
    session.beginDialog('actions:/');
  }*/
]).set('storage', inMemoryStorage);

//Sub-Dialogs
bot.library(require('./dialogs/greetings'));
bot.library(require('./dialogs/actions'));

//bot.library(require('./recognizers'));

/*
//handle error
bot.on('error', function (e) {
    console.log('And error ocurred', e);
    session.send(`No ché que ha pachado!`);
});
*/
