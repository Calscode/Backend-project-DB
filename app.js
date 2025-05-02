const express = require("express")
const app = express() 
const { getEndpoints, getTopics, getArticleId, getArticles, getComments, postComment, patchArticle, patchVotes } = require("./controller");
app.use(express.json());


app.get("/api", getEndpoints)

app.get("/api/topics", getTopics)

app.get("/api/articles/:article_id", getArticleId)

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id/comments", getComments)

app.post("/api/articles/:article_id/comments", postComment)

// app.patch("/api/articles/:article_id", patchArticle)

app.patch("/api/articles/:article_id", patchVotes)

app.use((err, req, res, next) => {

  
    if (err.code === "22P02") {
        
      res.status(400).send({ msg: "Invalid input" });
    } else if (err.code === "23503") {
    
      res.status(404).send({ msg: "Article or User not found" });
    } else if (err.code === "23502") {
   
      res.status(400).send({ msg: "Bad Request - Missing data" });
    } else {

      res.status(500).send({ msg: "Internal Server Error" });
    }
  });

module.exports = app;