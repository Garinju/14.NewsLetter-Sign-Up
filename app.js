// The Required Packages
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const async = require("async");
const app = express();

//app.use(s)
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

//first call to mail chimp
mailchimp.setConfig({
  apiKey: process.env.API_KEY,
  server: "us7"
});

async function callPing() {
  const response = await mailchimp.ping.get();
  console.log(response);
}

callPing();

//response to GET rquest for the root route
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
})

//function that gets triggered when a post request to root is made
app.post("/", function(req, res) {
//declaring constant of listId
  const listId = process.env.LIST_ID;
//declaring constant of subscribingUser which contained firstName, lastName, and email object with their respective value
  const subscribingUser = {
  firstName: req.body.firstName,
  lastName: req.body.lastName,
  email: req.body.email
};
//declaring a function of run to do addListMember method
async function run() {
  const response = await mailchimp.lists.addListMember(listId, {
    email_address: subscribingUser.email,
    status: "subscribed",
    merge_fields: {
      FNAME: subscribingUser.firstName,
      LNAME: subscribingUser.lastName
    }
  });

  console.log(
    `Successfully added contact as an audience member. The contact's id is ${
      response.id
    }.`
  );
}

run();
if (res.statusCode===200){
  res.send("Subscribed")
}
else {
  res.send("go fuck yourself")
}
});

app.listen(process.env.PORT||3000, function(req, res) {
  console.log("the server is running on port 3000");
});

