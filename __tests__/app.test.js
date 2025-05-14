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
        console.log(response.body.article, "<---------");
        
        expect(response.body.article).toEqual(
          {
            article_id: 1,
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'I find this existence challenging',
            created_at: '2020-07-09T20:11:00.000Z',
            votes: 100,
            article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
            comment_count: '11'
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
    test("200: Responds with all articles excluding body", () => {
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

  test("400: returns error for invalid sort_by column", () => {
    return request(app)
      .get("/api/articles?sort_by=banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid sort_by query");
      });
  });
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
  describe("POST /api/articles/:article_id/comments", () => {
    test("201: Responds with a newly added message", () => {
      const newComment = { body: "I really love this comment!",
        username: "Calvin"
      }
      return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(201)
      .then((response) => {
        const newlyPostedComment = response.body.comment
        expect(newlyPostedComment).toMatchObject({
          article_id: 2,
          author: "Calvin",
          body: "I really love this comment!"
        })
        expect(typeof newlyPostedComment.comment_id).toBe("number");
        expect(typeof newlyPostedComment.created_at).toBe("string");
        expect(newlyPostedComment.votes).toBe(0);
      })
    })
    test("404: user doesn't exist (author)", () => {
      return request(app)
        .post("/api/articles/2/comments")
        .send({ username: "invalidUser", body: "Hello!" })
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Article or User not found");
        });
    });
  
    test("404: article doesn't exist", () => {
      return request(app)
        .post("/api/articles/9999/comments")
        .send({ username: "butter_bridge", body: "Hello!" })
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Article or User not found");
        });
    });
  
    test("400: invalid article_id (not a number)", () => {
      return request(app)
        .post("/api/articles/abc/comments")
        .send({ username: "butter_bridge", body: "Test comment" })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Invalid input");
        });
    });
  })
  
    test("400: missing comment body", () => {
      return request(app)
        .post("/api/articles/2/comments")
        .send({ username: "butter_bridge" })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Missing Username or Comment");
        });
    });
  
    test("400: missing username", () => {
      return request(app)
        .post("/api/articles/2/comments")
        .send({ body: "No username!" })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Missing Username or Comment");
        });
    });
    describe("PATCH /api/articles/:article_id", () => {
      test("200: Responds with an updated vote count", () => {
        const incomingVotes = { inc_votes: 44 }
        return request(app)
        .patch("/api/articles/2")
        .send(incomingVotes)
        .expect(200)
        .then((response) => {
          const updatedArticle = response.body.updatedArticle
          expect(updatedArticle).toMatchObject({
            title: "Sony Vaio; or, The Laptop",
            topic: "mitch",
            author: "icellusedkars",
            votes: 44,
          })
          expect(updatedArticle.votes).toBe(44)
          expect(typeof updatedArticle.created_at).toBe("string");
        })
      })
    })
    describe("DELETE /api/comments/:comment_id", () => {
      test("204: sucessfully deletes a comment", () => {
        return request(app)
        .delete("/api/comments/1")
        .expect(204)
        });
    });
      })
      test("400: invalid comment_id", () => {
        return request(app)
          .delete("/api/comments/not-a-number")
          .expect(400)
          .then((response) => {
            expect(response.body.msg).toBe("Bad request - comment_id must be a number");
          });
      });
    
      test("404: non-existent comment_id", () => {
        return request(app)
          .delete("/api/comments/9999") 
          .expect(404)
          .then((response) => {
            expect(response.body.msg).toBe("Comment not found");
          });
      });
   describe("GET /api/users" , () => {
    test("200: responds with an array of user objects with username, name, and avatar_url", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body.users)).toBe(true);
          expect(response.body.users.length).toBeGreaterThan(0);
          response.body.users.forEach((user) => {
              expect(user).toMatchObject({
                username: expect.any(String),
                name: expect.any(String),
                avatar_url: expect.any(String),
              })
          });
          });
        });
    });
    test("405: POST is not allowed", () => {
      return request(app)
        .post("/api/users")
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).toBe("Method not allowed");
        });
    });
  
    test("405: PUT is not allowed", () => {
      return request(app)
        .put("/api/users")
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).toBe("Method not allowed");
        });
    });
  
    test("405: PATCH is not allowed", () => {
      return request(app)
        .patch("/api/users")
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).toBe("Method not allowed");
        });
    });
  
    test("405: DELETE is not allowed", () => {
      return request(app)
        .delete("/api/users")
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).toBe("Method not allowed");
        });
    });
  