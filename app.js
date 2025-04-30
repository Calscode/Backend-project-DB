const express = require("express")
const app = express() 
const { getEndpoints, getTopics, getArticleId, getArticles } = require("./controller");
app.use(express.json());


app.get("/api", getEndpoints)

app.get("/api/topics", getTopics)

app.get("/api/articles/:article_id", getArticleId)

app.get("/api/articles", getArticles)


module.exports = app;