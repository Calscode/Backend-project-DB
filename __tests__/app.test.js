const endpointsJson = require("../endpoints.json");
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data/index');
const connection = require("../db/connection")
const request = require("supertest")
const app = require("../app")

beforeEach(() => {
  return seed(data);
})
afterAll(() => {
  return connection.end();
})

describe("project tests", () => {
  
  describe("GET /api", () => {
    test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
  describe("GET /api/topics", () => {
    test("200: Responds with all the topics", () => {
      return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        expect(response.body.topics).toHaveLength(3);
        response.body.topics.forEach((singleTopic) => {
          expect(singleTopic).toMatchObject({
            description: expect.any(String),
            slug: expect.any(String),
            img_url: expect.any(String)
        });
      })
    })
  })
  })
  describe("GET /api/articles/:article_id", () => {
    test("200: Responds with 1 article", () => {
      return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        expect(response.body.article.article_id).toBe(1)
        expect(response.body.article).toEqual(
          {
            article_id: 1,
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'I find this existence challenging',
            created_at: '2020-07-09T20:11:00.000Z',
            votes: 100,
            article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
          }
        )
      })
    })
    test("404: Responds with not found when article does not exist", () => {
      return request(app)
      .get("/api/articles/90001724")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article not found")
        
      })
    })
    test("400: responds with bad request when article_id is not a number", () => {
      return request(app)
        .get("/api/articles/not-a-number")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request - article_id must be a number");
        });
    });
  })
  describe("GET /api/articles", () => {
    test("200: Responds with all articles", () => {
      return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        expect(response.body.articles).toHaveLength(13)
        response.body.articles.forEach((singleArticle) => {
          expect(singleArticle).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          })
          expect(singleArticle).not.toHaveProperty("body");
      })
    })
  })
  })
  })
  describe("GET /api/articles/:article_id/comments", () => {
    test("200: Responds with all comments for 1 article", () => {
      return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comments).toHaveLength(11)
        
      })
    })
  })
  test("404: Responds with not found when article does not exist", () => {
    return request(app)
    .get("/api/articles/90001724/comments")
    .expect(404)
    .then((response) => {
      expect(response.body.msg).toBe("Article not found")
    })
  })
  test("400: responds with bad request when article_id is not a number", () => {
    return request(app)
      .get("/api/articles/not-a-number/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request - article_id must be a number");
      });
  });
  test("200: Responds with a message when there are no comments to inform the client", () => {
    return request(app)
    .get("/api/articles/2/comments")
    .expect(200)
    .then((response) => {
      expect(response.body.msg).toBe("No comments found for this article")
      })
  })
  })
