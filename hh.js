const restify = require('restify');
const Builder = require('botbuilder');
const Recast = require('recastai');
require('dotenv').config();
const PORT = process.env.PORT || 8080;
// Connection to Microsoft Bot Framework
const connector = new Builder.ChatConnector({
  appId: process.env.APP_ID,
  appPassword: process.env.APP_PASSWORD
});
// Bot config
const bot = new Builder.UniversalBot(connector);
// Recast.ai config
const recastClient = new Recast.request(process.env.RECAST);
// Event when message received
bot.dialog('/', (session) => {
  // Pass to Recast.ai
  recastClient.analyseText(session.message.text)
    .then(res => {
      const intent = res.intent();
      if (intent.slug === 'core') {
        session.send('Sorry to hear about that! I understand, please tell about her present mood');
      } else {
        session.send('Sorry, I need to train  myself am not working perfectly ! :(');
      }
    })
    .catch(() => session.send('I need some help right now :( Talk to me later!'));
});
// Server init
const server = restify.createServer();
server.listen(PORT);
server.post('/', connector.listen());
