const db = require("../connection")

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
      slug TEXT PRIMARY KEY,
      description TEXT NOT NULL,
      img_url TEXT
    )`)
  })
  .then(() => {
    return db.query(`CREATE TABLE users(
      username TEXT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      avatar_url TEXT
    )`)
  }) 
  .then(() => {
    return db.query(`CREATE TABLE articles(
      article_id SERIAL PRIMARY KEY,
      title VARCHAR(100) NOT NULL,
      topic TEXT REFERENCES topics(slug),
      author TEXT REFERENCES users(username),
      body TEXT,
      created_at DATE,
      votes INT DEFAULT 0,
      article_img_url TEXT
    )`)
  }) 
  .then(() => {
    return db.query(`CREATE TABLE comments(
      comment_id SERIAL PRIMARY KEY,
      article_id INT REFERENCES articles(article_id),
      body TEXT,
      votes INT DEFAULT 0,
      author VARCHAR REFERENCES users(username),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`)
  });
}
module.exports = seed;
