const endpoints = require("./endpoints.json");
const db = require("./db/connection");
const { fetchTopics } = require("./model");


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