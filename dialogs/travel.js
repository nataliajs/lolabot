const builder = require('botbuilder');

const library = new builder.Library('travel');
const https = require('https');

const subscriptionKey = '8400ada027324c55bf72efb25f912fef';
const host = 'api.cognitive.microsoft.com';
const path = '/bing/v7.0/search';

library.dialog('/', [
  session=>{
    const userName = session.userData['userName']?session.userData['userName']:'';
    builder.Prompts.text(session,`Ok,${userName} where do you want to go?`);
  },
  (session, results)=>{
    session.conversationData['destinationKey'] = results.response;
    session.send(`Nice place!`);
    builder.Prompts.time(session, `When do you want to go to ${results.response}?`);
  },
  (session, results)=>{
    session.dialogData.startDate = builder.EntityRecognizer.resolveTime([results.response]);
    builder.Prompts.time(session, `When do you want to go to return?`);
  },
  (session, results)=>{
    session.dialogData.endDate = builder.EntityRecognizer.resolveTime([results.response]);
    session.send(`Searching flights to ${session.conversationData.destinationKey} from ${session.dialogData.startDate} to ${session.dialogData.endDate}`);
  },
  (session)=>{
    if (subscriptionKey.length === 32) {
      const term = `flights Stockholm ${session.conversationData.destinationKey} ${session.dialogData.startDate} ${session.dialogData.endDate}`;
      bing_web_search(term);
    } else {
      console.log('Invalid Bing Search API subscription key!');
      console.log('Please paste yours into the source code.');
    }
  }
]);

let response_handler = function (response) {
    let body = '';
    response.on('data', function (d) {
        body += d;
    });
    response.on('end', function () {
        console.log('\nRelevant Headers:\n');
        for (var header in response.headers)
            // header keys are lower-cased by Node.js
            if (header.startsWith("bingapis-") || header.startsWith("x-msedge-"))
                 console.log(header + ": " + response.headers[header]);
        body = JSON.stringify(JSON.parse(body), null, '  ');
        console.log('\nJSON Response:\n');
        console.log(body);
    });
    response.on('error', function (e) {
        console.log('Error: ' + e.message);
    });
};

let bing_web_search = function (search) {
  console.log('Searching the Web for: ' + term);
  let request_params = {
        method : 'GET',
        hostname : host,
        path : path + '?q=' + encodeURIComponent(search),
        headers : {
            'Ocp-Apim-Subscription-Key' : subscriptionKey,
        }
    };

    let req = https.request(request_params, response_handler);
    req.end();
}

module.exports = library;

//https://github.com/Microsoft/BotBuilder-Samples/blob/master/Node/core-CustomState/app.js

//google key:     AIzaSyDebwO4Eeh1z1epe3fSlMS1erHCM6jY-Fw
