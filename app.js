const express = require("express")
const app = express() 
const { getEndpoints, getTopics, getArticleId, getArticles, getComments, postComment, patchVotes, deleteComment, getUsers } = require("./controller");
const cors = require('cors');
app.use(cors());
app.use(express.json());


app.get("/api", getEndpoints)

app.get("/api/topics", getTopics)

app.get("/api/articles/:article_id", getArticleId)

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id/comments", getComments)

app.post("/api/articles/:article_id/comments", postComment)

app.patch("/api/articles/:article_id", patchVotes)

app.delete("/api/comments/:comment_id", deleteComment)

app.get("/api/users", getUsers)

app.all("/api/users", (req, res) => {
    res.status(405).send({ msg: "Method not allowed" }); 
  });

  app.use((err, req, res, next) => {
 
    if (err.status && err.msg) {
      res.status(err.status).send({ msg: err.msg });
    
    } else if (err.code === "22P02") {
      res.status(400).send({ msg: "Invalid input" });

    } else if (err.code === "23503") {
      res.status(404).send({ msg: "Article or User not found" });

    } else if (err.code === "23502") {
      res.status(400).send({ msg: "Bad Request - Missing data" });
  
    } else {
      console.error(err);
      res.status(500).send({ msg: "Internal Server Error" });
    }
  });
module.exports = app;