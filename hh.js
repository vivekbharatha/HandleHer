const restify = require('restify');
const Builder = require('botbuilder');
const N = require('./N');
require('dotenv').config();
const PORT = process.env.PORT || 8080;
// Connection to Microsoft Bot Framework
const connector = new Builder.ChatConnector({
  appId: process.env.APP_ID,
  appPassword: process.env.APP_PASSWORD
});
// Bot config
const bot = new Builder.UniversalBot(connector);
// Root Dialog
bot.dialog('/', [
  function (session, args, next) {
    if (!session.userData.name) {
        session.beginDialog('/profile');
    } else {
        next();
    }
  },
  function (session) {
    Builder.Prompts.text(session, 'Heya ' + session.userData.name + '! Howz everything going ?');
    //TODO:: Need to start actual conversation from here
  },
  function (session, results, next) {
    if (N.classify(results.response) === 's1') {
      Builder.Prompts.text(session, 'Sorry to hear about that! I understand, please tell about her present mood');
    } else if (N.classify(results.response) === 'bye') {
      session.send('TATA!');
    } else {
      session.send('Sorry, I need to train  myself am not working perfectly ! :(');
    }
  },
  function (session, results, next) {
    session.send('hhmm, I suggest to stay away from her!');
  }
]);

bot.dialog('/profile', [
  function (session) {
    Builder.Prompts.text(session, 'Heya whatsup! I didn\'t recognize you, what\'s your name ?');
  },
  function (session, results) {
    session.userData.name = results.response;
    session.endDialog();
  }
]);

// Event when message received
/*bot.dialog('/', (session) => {
  // Use internal N tool
  if (N.classify(session.message.text) === 's1') {
    session.send('Sorry to hear about that! I understand, please tell about her present mood');
  } else {
    session.send('Sorry, I need to train  myself am not working perfectly ! :(');
  }
});*/
// Server init
const server = restify.createServer();
server.listen(PORT);
server.post('/', connector.listen());
