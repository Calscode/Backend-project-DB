const db = require("../../db/connection");
const articles = require("../data/test-data/articles");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.referenceObject = (articlesArray) => {
  if (articlesArray.length === 0){
    return {};
  }
  const result = {};
  articlesArray.forEach((article) => {
    result[article.title] = article.article_id
  })
  return result;
}



