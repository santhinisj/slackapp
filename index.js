const { App } = require("@slack/bolt");
const store = require("./store");
const appHome = require("./appHome");
const allUsersList = require("./allUsersList");
const axiosHandler = require("./axiosHandler");

const { WebClient } = require("@slack/web-api");
const web = new WebClient(process.env.SLACK_SIGNING_SECRET);

const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN
});


app.event("app_home_opened", async ({ say, event, body, context, payload }) => {
  // Display App Home
  const homeView = await appHome.createHome(event.user);
  console.log("hello", event);
  await say(`Hello`);
  try {
    const result = await app.client.views.publish({
      token: context.botToken,
      user_id: event.user,
      view: homeView
    });
  } catch (e) {
    // console.log(e);
    app.error(e);
  }
});

app.message("hi", async ({ body,message,context, say }) => {
  console.log(message);
  try{
    // const { data } = await axiosHandler.makeAPICall('POST', `/spotlight/user_details/`, {})
    // exports.makeAPICall = async (method, url, payload = {}, attachHeaders = false) => {
  }catch(e){
    
  }
  // console.log(message);
  await say(`Hello, <@${message.user}>`);
});

// app.command("/splt", adynx)
// Receive button actions from App Home UI "Add a Stickie"
app.action("settings", async ({ body, context, ack }) => {
  ack();

  // Open a modal window with forms to be submitted by a user
  const view = appHome.openModal();

  try {
    const result = await app.client.views.open({
      token: context.botToken,
      trigger_id: body.trigger_id,
      view: view
    });
  } catch (e) {
    console.log(e);
    app.error(e);
  }
});

app.action("setting_option_select", async ({ body, context, ack }) => {
  ack();
  console.log(body.actions);
});

app.action("launch_spotlight", async ({ event, body, context, ack }) => {
  ack();
  allUsersList.getAllUsers({ token: context.botToken });
});

// Receive view_submissions
app.view("modal_view", async ({ ack, body, context, view }) => {
  ack();
  console.log(body, view);
  const ts = new Date();

  const data = {
    timestamp: ts.toLocaleString(),
    note: view.state.values.note01.content.value,
    color: view.state.values.note02.color.selected_option.value
  };

  const homeView = await appHome.createHome(body.user.id, data);

  try {
    const result = await app.client.apiCall("views.publish", {
      token: context.botToken,
      user_id: body.user.id,
      view: homeView
    });
  } catch (e) {
    console.log(e);
    app.error(e);
  }
});

//when someone joins the channel
app.event("team_join", async ({ event, context, client }) => {
  try {
    // const { data } = await a
    
    
    // Call chat.postMessage with the built-in client
    const result = await app.client.chat.postMessage({
      channel: event.user,
      token: context.botToken
    });
    console.log(result);
  } catch (error) {
    console.error(error);
  }
});

// Start your app
(async () => {
  await app.start(process.env.PORT || 3000);
  console.log("⚡️ Bolt app is running!");
})();

module.exports = { app };
