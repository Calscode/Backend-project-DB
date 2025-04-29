const db = require("./db/connection");


exports.fetchTopics = () => {
    return db.query("SELECT * FROM topics;").then((result) => {
      return result.rows;
    });
  };
exports.fetchArticleId = (article_id) => {
    return db.query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then((result) => {
        return result.rows[0];
    })
}
  