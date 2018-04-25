const builder = require('botbuilder');
const promise = require('request-promise');

const requestUrl = 'https://northeurope.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment';
const header = {'Content-Type':'application/json',
'Ocp-Apim-Subscription-Key':'d0751ec89be3436e801fb2794d838ab9'}

const library = new builder.Library('greetings');

library.dialog('/', [
  function(session){
    builder.Prompts.text(session, 'Hi! What is your name?');
  },
  function(session, results){
    session.userData['userName'] = results.response;
    session.send(`Hello ${results.response}`);
    session.send(`My name is Lola. Nice to meet you`);
    var currentdate = new Date();
    if(currentdate.getHours()<12){
      session.beginDialog('goodMorning');
    }else if(currentdate.getHours()>12 && currentdate.getHours()<19){
      session.beginDialog('goodAfternoon');
    }else if(currentdate.getHours()>19){
      session.beginDialog('goodEvening');
    }
  },
  function(session, results){
    // fetch Text Analytics API to get a score 0 to 1 based on user response
    getSentiment(results.response).then(apiResponse=>{
      const score = apiResponse.documents[0].score;
      session.send(`getSentiment score ${score}`);
      var emotionalState = 'good';
      if(score<0.2){
        emotionalState='crisis'
      }else if(score>0.2 && score<0.4){
        emotionalState='sad'
      }else if(score>0.4 && score<0.6){
        emotionalState='fine'
      }else if(score>0.6 && score<0.8){
        emotionalState='great'
      }else if(score>0.8){
        emotionalState='awesome'
      }
      session.send(emotionalState);
      session.beginDialog('giphy:/', { searchString: emotionalState });
    }).catch(error=>{
      console.log(error);
      session.send(error);
    });
  },
  function(session){
    session.endDialog();
  }
]);

library.dialog('goodMorning', [
  function(session){
    builder.Prompts.text(session, 'Good morning, Did you sleep well?');
  },
  function (session, results) {
    session.endDialogWithResult(results);
  }
]);

library.dialog('goodAfternoon', [
  function(session){
    builder.Prompts.text(session, 'Good afternoon, Do you enjoy the day?');
  },
  function (session, results) {
    session.endDialogWithResult(results);
  }
]);

library.dialog('goodEvening', [
  function(session){
    builder.Prompts.text(session, 'Good evening, Have you had a nice day?');
  },
  function (session, results) {
    session.endDialogWithResult(results);
  }
]);

function getSentiment(message) {
    var options = {
        method: 'POST',
        uri: requestUrl,
        body: {
          documents:[{id:'1', language: 'en', text:message}]
        },
        json: true, // Automatically stringifies the body to JSON,
        headers: header
    };
    return promise(options);
}

library.library(require('./giphy'));

module.exports = library;
