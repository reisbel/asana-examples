let asana = require('asana');

// Get personal access token (PAT) from environment variables.
const accessToken = process.env.asana_hello_world_pat;

const deprecationHeaders = {"defaultHeaders": {"asana-enable": "new_sections,string_ids"}};

// construct an Asana client
var client = asana.Client.create(deprecationHeaders).useAccessToken(accessToken);

// Get your user info
client.users.me()
  .then(function(me) {
    // Print out your information
    console.log('Hello world! ' + 'My name is ' + me.name + '.');
});