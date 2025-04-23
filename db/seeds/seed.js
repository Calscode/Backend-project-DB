const db = require("../connection")
const format = require("pg-format")

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db
  .query(`DROP TABLE IF EXISTS comments`)
  .then(() => {
   return db.query(`DROP TABLE IF EXISTS articles`)
  })
  .then(() => {
   return db.query(`DROP TABLE IF EXISTS users`)
  })
  .then(() => {
   return db.query(`DROP TABLE IF EXISTS topics`)
  })
  .then(() => {
    return db.query(`CREATE TABLE topics (
      slug VARCHAR(1000) PRIMARY KEY,
      description VARCHAR(1000) NOT NULL,
      img_url VARCHAR(1000)
    )`)
  })
  .then(() => {
    return db.query(`CREATE TABLE users(
      username VARCHAR(1000) PRIMARY KEY,
      name VARCHAR(1000) NOT NULL,
      avatar_url VARCHAR(1000)
    )`)
  }) 
  .then(() => {
    return db.query(`CREATE TABLE articles(
      article_id SERIAL PRIMARY KEY,
      title VARCHAR(1000) NOT NULL,
      topic VARCHAR(1000) REFERENCES topics(slug),
      author VARCHAR(1000) REFERENCES users(username),
      body TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      votes INT DEFAULT 0,
      article_img_url VARCHAR(1000)
    )`)
  }) 
  .then(() => {
    return db.query(`CREATE TABLE comments(
      comment_id SERIAL PRIMARY KEY,
      article_id INT REFERENCES articles(article_id),
      body TEXT,
      votes INT DEFAULT 0,
      author VARCHAR(1000) REFERENCES users(username),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`)
    .then(() => {
      const formattedTopics = topicData.map(({ slug, description, img_url }) => [
        slug,
        description,
        img_url,
      ]);
      const queryStr = format(
        `INSERT INTO topics (slug, description, img_url) VALUES %L`,
        formattedTopics
      );
      return db.query(queryStr);
    })
    .then(() => {
      const formattedUsers = userData.map(({ username, name, avatar_url }) => [
        username,
        name,
        avatar_url,
      ]);
      const queryStr = format(
        `INSERT INTO users (username, name, avatar_url) VALUES %L`,
        formattedUsers
      );
      return db.query(queryStr);
    })
    .then(() => {
      const formattedArticles = articleData.map(
        ({
          title,
          topic,
          author,
          body,
          created_at,
          votes,
          article_img_url,
        }) => [
          title,
          topic,
          author,
          body,
          new Date(created_at),
          votes,
          article_img_url,
        ]
      );
      const queryStr = format(
        `INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *`,
        formattedArticles
      );
      return db.query(queryStr);
    })
    .then(() => {
      const formattedComments = commentData.map(
        ({ article_id, body, votes, author, created_at }) => [
          article_id,
          body,
          votes,
          author,
          new Date(created_at), 
        ]
      );
      const queryStr = format(
        `INSERT INTO comments (article_id, body, votes, author, created_at) VALUES %L`,
        formattedComments
      );
      return db.query(queryStr);
    });
})
}
module.exports = seed;
