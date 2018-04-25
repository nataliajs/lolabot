const builder = require('botbuilder');
const promise = require('request-promise');

const library = new builder.Library('giphy');

library.dialog('/', [
  (session, args)=>{
    getGiphy(args.searchString).then(response=>{
      const giphUrl = JSON.parse(response).data.images.original.url;
      session.send({
        attachments: [
          {
            contentType: 'image/gif',
            contentUrl: giphUrl,
            name: args.searchString,
          }
        ]
      });
      session.endDialog();
    })
    .catch( error=>{
      session.send(`giphy error ${error} args.searchString ${args.searchString}`);
      session.endDialog();
    })
  }
]);

module.exports = library;

function getGiphy(searchString) {
  var options = {
    method: 'GET',
    uri: 'https://api.giphy.com/v1/gifs/translate',
    qs: {
      s: searchString,
      api_key: 'RXs68GHcPHn68ZrpKl1I1jlkwPBoHNRV'
    }
  }
  return promise(options);
}
