# Asana integration Hello World

Run a custom request against the Asana API to get some information.

## Autenticate your app

We will need to authenticate using a Personal Access Token (PAT) in order to execute requeest againg the Asana API. Log in to the Asana account and navigate to the developer console. You can get to your dev console by either using this URL https://app.asana.com/-/developer_console or from within Asana by clicking your photo icon in the upper right of Asana -> My Profile Settings -> Apps -> Manage Developer Apps.

Next, click “+ New access token” and follow the instructions to get your token. Treat this token like a username and password. Don’t share it with anyone and never publish it to a public repository. Save the PAT as an environment variable. For this guide, I’ve saved a PAT as an environment variable asana_hello_world_pat.

## Steps

Initialice project

```bash
npm init
```

Install the Node Asana client library and create app file:

```bash
npm install asana
touch config app.js
```

Application code

```node
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
```

Test application

```bash
node index.js
```

Example output:

```bash
Hello world! My name is Reisbel Machado.
```

## References

[Asana EXAMPLES & TUTORIALS](https://asana.com/developers/documentation/examples-tutorials/triage-bot)

[Setting up Environment Variables in MacOS Sierra](https://medium.com/@himanshuagarwal1395/setting-up-environment-variables-in-macos-sierra-f5978369b255)
