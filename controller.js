const endpoints = require("./endpoints.json");
const db = require("./db/connection");
const { fetchTopics, fetchArticleId } = require("./model");


exports.getEndpoints = (req, res) => {
    res.status(200).send({endpoints})
    }

exports.getTopics = (req, res, next) => {
    fetchTopics()
    .then((topics) => {
        res.status(200).send({topics})
    })
    .catch(next);
   }
exports.getArticleId = (req, res, next) => {
    const article_id = req.params.article_id
    fetchArticleId(article_id)
    .then((article) => {
        res.status(200).send({article})
    })
    .catch(next)
}