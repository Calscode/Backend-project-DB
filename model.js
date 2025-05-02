const db = require("./db/connection");


exports.fetchTopics = () => {
    return db.query("SELECT * FROM topics;")
    .then((result) => {
      return result.rows;
    });
  };
exports.fetchArticleId = (article_id) => {
    return db.query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then((result) => {
        return result.rows[0];
    })
}
exports.fetchArticles = () => {
    return db.query(
        `SELECT 
        articles.article_id, 
        articles.title, 
        articles.topic, 
        articles.author, 
        articles.created_at, 
        articles.votes, 
        articles.article_img_url, 
        COUNT(comments.article_id)::INT AS comment_count 
        FROM articles 
        LEFT JOIN comments 
        ON articles.article_id = comments.article_id 
        GROUP BY articles.article_id 
        ORDER BY articles.created_at DESC;`)
    .then((result) => {
        return result.rows
    })
}
  exports.fetchComments = (article_id) => {
    return db.query(
        `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`, [article_id])
        .then((result) => {
            // console.log(result.rows);
            return result.rows
        })
  }
  exports.insertComment = (article_id, author, body) => {
    const query = `
    INSERT INTO comments (article_id, author, body)
    VALUES ($1, $2, $3)
    RETURNING *;`;

    return db.query(query, [article_id, author, body]).then((result) => {
        return result.rows[0];
    })
  }
//   exports.updateArticle = (article_id, newBody) => {
//     const query = `
//     UPDATE articles
//     SET body = $1
//     WHERE article_id = $2
//     RETURNING *;
//     `
//     return db.query(query, [newBody, article_id]).
//     then((result) => {
//         console.log(newBody);
        
//         return result.rows[0];
//     })
// }
    exports.updateVotes = (article_id, inc_votes) => {
    const query = `
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *;
    `
    return db.query(query, [inc_votes, article_id]).
    then((result) => {
        console.log(result.rows[0], "<-------")
        return result.rows[0]
    })
  }