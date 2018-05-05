const builder = require('botbuilder');

const library = new builder.Library('actions');

library.dialog('/', [
  session=>{
    builder.Prompts.choice(session, "What would you like to do?", "Travel|Sport", { listStyle: builder.ListStyle.button });
  },
  (session, results)=>{
    session.send(`Let's ${results.response.entity.toLowerCase()}!`);
    switch (results.response.entity.toLowerCase()) {
      case 'travel':
        session.beginDialog('travel:/');
        break;
      case 'sport':
        session.beginDialog('sport:/');
        break;
      default:
        session.endDialog();
    }
  }
]);

module.exports = library;
