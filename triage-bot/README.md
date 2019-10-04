# Asana integration Hello World

Run a custom request bot against the Asana API to assign some tasks.

## Autenticate your app

We will need to authenticate using a Personal Access Token (PAT) in order to execute requeest againg the Asana API. Log in to the Asana account and navigate to the developer console. You can get to your dev console by either using this URL https://app.asana.com/-/developer_console or from within Asana by clicking your photo icon in the upper right of Asana -> My Profile Settings -> Apps -> Manage Developer Apps.

Next, click “+ New access token” and follow the instructions to get your token. Treat this token like a username and password. Don’t share it with anyone and never publish it to a public repository. Save the PAT as an environment variable. For this guide, I’ve saved a PAT as an environment variable asana_triage_bot__pat.

## Create a sandox

Before we start coding, create a project in Asana to use as a sandbox. While not required, I like to set the project to private while developing. To get some users in the project, add your main Asana user as well as your bot account. You could also invite a personal email as a guest user.

## Steps

Initialice project

```bash
npm init
```

Install the Node Asana client library and create app file:

```bash
npm install asana
touch config.js app.js
```

Application configuration: Add gids (global ids) for the workspace, design request project, and designers that will be assigned requests (note that all ids in Asana should be strings). You can get a project’s gid from its URL in the Asana web product (e.g. the structure of links for a task is www.asana.com/0//). Similarly, you can get user’s gid from the URL of their task list (i.e. click on their name in Asana). To get your workspace gid(s), go to <https://app.asana.com/api/1.0/users/me/workspaces.>

```node
let config = {
    workspaceId: "463064983701563",
    designRequestProjectId: "1143263452842209",
    //gids of designers who are fulfilling design requests
    designers: ["36853475924463"]
  }
  
  module.exports = config;
```

Application code (app.js)

```node
const asana = require("asana");
const config = require("./config");

// Get personal access token (PAT) from environment variables.
const accessToken = process.env.asana_hello_world_pat;

// At the time of writing this guide, the Asana API is going through
// two deprecations (moving to string ids and changing how sections function).
// You can learn about our deprecations framework in our docs
// (https://asana.com/developers/documentation/getting-started/deprecations).
// To prevent this bot from breaking when the deprecations are finalized, I'm
// passing headers to enable the new API behavior for string gids and sections.
const deprecationHeaders = {"defaultHeaders": {"asana-enable": "new_sections,string_ids"}};

// Create Asana client using PAT and deprecation headers.
const client = asana.Client.create(deprecationHeaders).useAccessToken(accessToken);

// Request delay in ms. We will use this to avoid hitting Asana rate limits:
// https://asana.com/developers/documentation/getting-started/rate-limits
const delay = 200;


// Request the unassigned tasks (up to 100) from the specified project
// and pass the array of unassigned tasks to randomAssigner().
function getUnassignedTasks() {
  let workspaceId = config.workspaceId;
  let params = {
    "projects.any" : config.designRequestProjectId,
    "assignee.any" : "null",
    "resource_subtype": "default_task",
    "fields": "gid",
    "limit": 100
  };
  client.tasks.searchInWorkspace(workspaceId, params).then(tasks => {
    randomAssigner(tasks.data);
  });
}

// Helper function to randomly shuffle an array. We will use it to
// randomize the list of Asana users fulfilling requests.
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

// Helper function to assign a task in Asana.
function assignTask(taskStringId, assigneeStringId) {
  client.tasks.update(taskStringId, {assignee: assigneeStringId});
}

// Takes an array of unassigned tasks and assigns a designer to
// each task.
function randomAssigner(unassignedTasks) {
  let shuffledDesigners = shuffleArray(config.designers);
  let numDesigners = shuffledDesigners.length;
  // We will use an interval to control how quickly requests are sent
  // in order to avoid being rate limited. The interval uses the
  // const delay, which determines how long to wait between requests.
  let index = 0;
  let interval = setInterval(function() {
    assignTask(unassignedTasks[index].gid, shuffledDesigners[index % numDesigners]);
    index++;
    if (index >= unassignedTasks.length) {
      clearInterval(interval);
      console.log("You've assigned " + unassignedTasks.length + " new design requests");
    }
  }, delay);
}

// Run the triage bot.
getUnassignedTasks();


// Potential enhancements to add to the bot:
//   -Find tasks that are nearly due and remind the assignee.
//   -Ping over due tasks with a snarky message.
//   -Use web hooks to keep the triage bot synced in real time.
```

Test application

```bash
node app.js
```

Example output:

```bash
You've assigned 3 new design requests
```

## References

[Asana EXAMPLES & TUTORIALS](https://asana.com/developers/documentation/examples-tutorials/triage-bot)

[Setting up Environment Variables in MacOS Sierra](https://medium.com/@himanshuagarwal1395/setting-up-environment-variables-in-macos-sierra-f5978369b255)
