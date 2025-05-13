const db = require("./db/connection");


exports.fetchTopics = () => {
    return db.query("SELECT * FROM topics;")
    .then((result) => {
      return result.rows;
    });
  };
  exports.fetchArticleId = (article_id) => {
    return db
      .query(
        `SELECT articles.*, 
                (SELECT COUNT(*) FROM comments WHERE article_id = $1) AS comment_count 
         FROM articles WHERE article_id = $1;`, 
        [article_id]
      )
      .then((result) => {
        if (result.rows.length === 0) {
          return Promise.reject({ status: 404, msg: "Article not found" });
        }
        return result.rows[0];
      });
  };
exports.fetchArticles = (sort_by = "created_at", order = "desc") => {
    const validSortColumns = [
        "article_id",
        "title",
        "topic",
        "author",
        "created_at",
        "votes",
        "article_img_url",
        "comment_count"
    ];
    const validOrders = ["asc", "desc"];


    if (!validSortColumns.includes(sort_by)) {
        return Promise.reject({ status: 400, msg: "Invalid sort_by query" });
    }
    if (!validOrders.includes(order)) {
        return Promise.reject({ status: 400, msg: "Invalid order query" });
    }

    const queryStr = `
        SELECT 
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
        ORDER BY ${sort_by} ${order};
    `;

    return db.query(queryStr).then((result) => {
        return result.rows;
    });
};
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
  exports.updateVotes = (article_id, inc_votes) => {
    const query = `
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *;
    `
    return db.query(query, [inc_votes, article_id]).
    then((result) => {
        return result.rows[0]
    })
  }
  exports.removeComment = (comment_id) => {
    const query = `
    DELETE FROM comments
    WHERE comment_id = $1
    RETURNING *;
    `
    return db.query(query, [comment_id])
    .then((result) => {
        
        return result.rows;
    })
  }
  exports.fetchUsers = () => {
    return db.query("SELECT * FROM users;")
    .then((result) => {
      return result.rows;
    });
  }