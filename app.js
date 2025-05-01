const express = require("express")
const app = express() 
const { getEndpoints, getTopics, getArticleId, getArticles, getComments, postComment } = require("./controller");
app.use(express.json());


app.get("/api", getEndpoints)

app.get("/api/topics", getTopics)

app.get("/api/articles/:article_id", getArticleId)

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id/comments", getComments)

app.post("/api/articles/:article_id/comments", postComment)

app.use((err, req, res, next) => {
    console.log("ERROR:", err);
  
    if (err.code === "22P02") {
      // Invalid input syntax for integer (e.g. non-numeric article_id)
      res.status(400).send({ msg: "Invalid input" });
    } else if (err.code === "23503") {
      // Foreign key violation (invalid username or article_id)
      res.status(404).send({ msg: "Article or User not found" });
    } else if (err.code === "23502") {
      // Not null violation - likely missing required fields
      res.status(400).send({ msg: "Bad Request - Missing data" });
    } else {
      // Fallback for unexpected errors
      res.status(500).send({ msg: "Internal Server Error" });
    }
  });

module.exports = app;