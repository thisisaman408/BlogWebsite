const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const ejs = require("ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
const content = require(__dirname + "/views/content.js");
app.set("view engine", "ejs");

let posts = [];

const homeStartingContent = content.homeContent;
const aboutContent = content.aboutContent;
const contactContent = content.contactContent;

app.get("/", function (req, res) {
  res.render("home", {
    homeStartingContent: homeStartingContent,
    posts: posts,
  });
});

app.get("/about", (req, res) => {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", (req, res) => {
  res.render("contact", { contactContent: contactContent });
});

app.get("/compose", (req, res) => {
  res.render("compose");
});
app.post("/compose", (req, res) => {
  const composedText = req.body.composetext;
  const title = req.body.heading;
  const index = req.body.index;
  posts.push({ title: title, text: composedText });
  res.redirect("/");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
