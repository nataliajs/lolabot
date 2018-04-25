const builder = require('botbuilder');

const library = new builder.Library('travel');

library.dialog('/', [
  session=>{
    const userName =
    session.Prompts.text('Ok, ');
  },
  (session, results)=>{

  }
]);

library.library(require('./travel'));

module.exports = library;
