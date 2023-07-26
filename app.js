const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _=require("lodash");
const mongoose = require("mongoose");
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");
const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
});
const Article = mongoose.model("Article", articleSchema);

/////////////////////////request targeting all targets//////////////////////

app
  .route("/articles")
  .get((req, res) => {
    Article.find()
      .then((foundArticles) => {
        res.send(foundArticles);
        console.log(foundArticles);
      })
      .then((error) => {
        console.log(error);
      });
  })

  .post((req, res) => {
    console.log(req.body.title);
    console.log(req.body.content);
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    newArticle
      .save()
      .then(() => {
        res.send("successful");
      })
      .catch((error) => {
        console.log(error);
        res.status(500).send("Error occurred while saving the article");
      });
  })

  .delete((req, res) => {
    Article.deleteMany()
      .then(() => {
        res.send("successfully deleted");
      })
      .catch((error) => {
        res.send(error);
      });
  });

/////////////////////////request targeting specific single targets//////////////////////

app
  .route("/articles/:articleTitle")
  .get((req, res) => {
    const articleLodash=_.capitalize(req.params.articleTitle)
    Article.findOne({ title: articleLodash})
      .then((found) => {
        // console.log(found);
        res.send(found);
      })
      .catch((error) => {
        res.send(error);
      });
  })

  .delete((req, res) => {
    Article.deleteOne({ title: req.params.articleTitle })
      .then(() => {
        res.send("deleted successfully");
      })
      .catch((error) => {
        res.send(error);
      });
  })

  .put((req, res) => {
    Article.updateOne(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      { overwite: true }
    )
      .then((updated) => {
        res.send(updated);
      })
      .catch((error) => {
        res.send(error);
      });
  })


.patch((req,res)=>{
Article.updateOne({title:req.params.articleTitle},{$set:req.body})
.then(updtedPatch=>{
  res.send(updtedPatch + "successfull");
})
.catch(error=>{
  res.send(error);
})
})



app.listen(3000, function () {
  console.log(`Server running on port 3000`);
});
