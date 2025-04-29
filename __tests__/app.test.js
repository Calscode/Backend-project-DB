const endpointsJson = require("../endpoints.json");
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data/index');
const connection = require("../db/connection")
const request = require("supertest")
const app = require("../app")
const db = 

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
})