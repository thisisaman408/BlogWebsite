const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const ejs = require("ejs");
app.set("view engine", "ejs");
const mongoose = require("mongoose");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
const content = require(__dirname + "/views/content.js");
app.use(express.json());
const _ = require("lodash");
require("dotenv").config();

const db = process.env.db;
mongoose.connect(db);

const homeStartingContent = content.homeContent;
const aboutContent = content.aboutContent;
const contactContent = content.contactContent;

const postSchema = new mongoose.Schema({
  title: String,
  text: String,
});

const Post = mongoose.model("Post", postSchema);

app.get("/", function (req, res) {
  Post.find()
    .then((posts) => {
      res.render("home", {
        homeStartingContent: homeStartingContent,
        posts: posts,
      });
    })
    .catch((error) => {
      console.log("Error retrieving posts: ", error);
      res.status(500).send("Internal Server Error");
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

app.get("/posts/:postId", (req, res) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (post) {
        res.render("post", { post: post });
      } else {
        console.log("Post not found with ID:", postId);
        res.status(404).send("Post not found");
      }
    })
    .catch((error) => {
      console.log("Error retrieving post: ", error);
      res.status(500).send("Internal Server Error");
    });
});

app.post("/compose", (req, res) => {
  const composedText = req.body.composetext;
  const title = req.body.heading;

  if (!title || !composedText) {
    return res.status(400).send("Title and content are required.");
  }

  const post = new Post({
    title: title.trim(),
    text: composedText,
  });

  post
    .save()
    .then(() => {
      res.redirect("/");
    })
    .catch((error) => {
      console.log("Error saving post: ", error);
      res.status(500).send("Error saving post");
    });
});

app.post("/delete", (req, res) => {
  const postId = req.body.deleteIndex;

  if (!postId) {
    return res.status(400).send("Post ID is required.");
  }

  Post.deleteOne({ _id: postId })
    .then(() => {
      console.log("Post deleted successfully");
      res.redirect("/");
    })
    .catch((error) => {
      console.log("Error deleting post: ", error);
      res.status(500).send("Error deleting post");
    });
});

app.post("/edit", (req, res) => {
  const postId = req.body.index;
  const updatedTitle = req.body.title.trim();
  const updatedContent = req.body.content;

  Post.updateOne({ _id: postId }, { title: updatedTitle, text: updatedContent })
    .then(() => {
      console.log("Post updated successfully");
      res.json({ success: true, message: "Post updated successfully" });
    })
    .catch((error) => {
      console.log("Error updating post: ", error);
      res.status(400).json({ success: false, message: "Error updating post" });
    });
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
