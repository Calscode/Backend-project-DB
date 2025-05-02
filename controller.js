const endpoints = require("./endpoints.json");
const db = require("./db/connection");
const { fetchTopics, fetchArticleId, fetchArticles, fetchComments, insertComment, updateArticle, updateVotes } = require("./model");


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
    
    if (isNaN(article_id)) {
        return res.status(400).send({msg: "Bad request - article_id must be a number"});
    }
    fetchArticleId(article_id)
    .then((article) => {
        if (!article) {
            return res.status(404).send({ msg: "Article not found"});
        }
        res.status(200).send({article})
    })
    .catch(next)
}
exports.getArticles = (req, res, next) => {
    fetchArticles()
    .then((articles) => {
        res.status(200).send({articles})
    })
    .catch(next)
}
exports.getComments = (req, res, next) => {
    const article_id = req.params.article_id
        if (isNaN(article_id)) {
        return res.status(400).send({msg: "Bad request - article_id must be a number"});
    }
    fetchArticleId(article_id)
    .then((article) => {
        if (!article) {
            return res.status(404).send({ msg: "Article not found"});
        }
        return fetchComments(article_id)

    })
    .then((comments) => {
        if (comments.length === 0) {
           return res.status(200).send({comments: [], msg: "No comments found for this article"})
        }
        res.status(200).send({ comments })
    })
    .catch(next)
}
exports.postComment = (req, res, next) => {
    const { username, body } = req.body
    const { article_id } = req.params
    if (!username || ! body){
        return res.status(400).send({msg: "Missing Username or Comment"})
    }
    insertComment(article_id, username, body)
    .then((comment) => {
        res.status(201).send({ comment });
    })
    .catch(next)
}
// exports.patchArticle = (req, res, next) => {
//     const { newBody } = req.body
//     const { article_id } = req.params

//     if (isNaN(article_id)) {
//         return res.status(400).send({msg: "Bad request - article_id must be a number"});
//     }
//     updateArticle(article_id, newBody)
//     .then((newArticle) => {
//         res.status(200).send({ newArticle })
//     })
//     .catch(next)
// }
exports.patchVotes = (req, res, next) => {
    const { inc_votes } = req.body
    const { article_id } = req.params

    if (isNaN(article_id)) {
        return res.status(400).send({msg: "Bad request - article_id must be a number"});
    }
    updateVotes(article_id, inc_votes)
    .then((updatedArticle) => {
        res.status(200).send({ updatedArticle })
    })
    .catch(next)
}