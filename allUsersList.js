let usersStore = {};
const file = require("./index");
const { App } = require("@slack/bolt");
const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN
});

const getAllUsers = async payload => {
  try {
    // Call the users.list method using the WebClient
    const result = await app.client.users.list(payload);

    console.log(result);
    saveUsers(result.members, payload);
  } catch (error) {
    console.error(error);
  }
};

// Put users into the JavaScript object
function saveUsers(usersArray, payload) {
  let userId = "";
  usersArray.forEach(function(user) {
    // Key user info on their unique user ID
    userId = user["id"];

    // Store the entire user object (you may not need all of the info)
    usersStore[userId] = user;
    postmessageForEachUser(userId, payload);
  });
}
const postmessageForEachUser = async (userId, payload) => {
  try {
    // Call the chat.postMessage method using the WebClient
    const result = await app.client.chat.postMessage({
      channel: userId,
      text: "Hello there, this is a test message!",
      ...payload
    });

    // console.log(result);
  } catch (error) {
    console.error(error);
  }
};



// const getSingleUserInfo = async (payload) => {
//   try {
//   // Call the users.info method using the WebClient
//   const result = await app.client.users.info(payload);
//   return result;
//   console.log(result);
// }
// catch (error) {
//   console.error(error);
// }

// }
module.exports = { getAllUsers, saveUsers };
