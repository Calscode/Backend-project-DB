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
        console.log(response.body.article)
      })
    })
  })
})