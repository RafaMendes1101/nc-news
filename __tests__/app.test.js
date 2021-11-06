const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const app = require("../app.js");
const { newComment } = require("../controllers/comments.controller.js");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("nc-news app", () => {
  describe("testing testData object", () => {
    it("test testData object", () => {
      expect(testData).toMatchObject({
        articleData: expect.any(Array),
        commentData: expect.any(Array),
        topicData: expect.any(Array),
        userData: expect.any(Array),
      });
    });
  });
  describe("GET /api", () => {
    test("responds with endpoins.json file content", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(body).toBeInstanceOf(Object);
        });
    });
  });
  describe("GET /api/topics", () => {
    test("status 200 responds with an array of topics", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(body.topics).toBeInstanceOf(Array);
          expect(body.topics).toHaveLength(3);
          body.topics.forEach((topic) => {
            expect(topic).toEqual(
              expect.objectContaining({
                slug: expect.any(String),
                description: expect.any(String),
              })
            );
          });
        });
    });
  });
  describe("GET /api/articles", () => {
    test("status 200 responds with an array of articles", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeInstanceOf(Array);
          expect(body.articles).toHaveLength(12);
          body.articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                article_id: expect.any(Number),
                title: expect.any(String),
                body: expect.any(String),
                votes: expect.any(Number),
                topic: expect.any(String),
                author: expect.any(String),
                created_at: expect.any(String),
              })
            );
          });
        });
    });
    test("status 200 order by article_id descending", () => {
      return request(app)
        .get("/api/articles?sort=article_id&&order=asc")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("article_id", { ascending: true });
        });
    });
    test("status 200 accepts a topic query and responds with an array of topic objects", () => {
      return request(app)
        .get("/api/articles?topic=cats")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toHaveLength(1);
          expect(body).toBeInstanceOf(Object);
        });
    });
    test("status 404 responds with Article not found.", () => {
      return request(app)
        .get("/api/articles?topic=csgo")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Article not found.");
        });
    });
    test("status 400 responds with Invalid sort param", () => {
      return request(app)
        .get("/api/articles?sort=banana")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid sort value banana");
        });
    });
    test("status 400 responds with Invalid order ", () => {
      return request(app)
        .get("/api/articles?order=banana")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid order value banana");
        });
    });
    test("status 404 reponds with Invalid route msg object when passed an invalid route", () => {
      return request(app).get("/api/bad_route").expect(404);
    });
  });
  describe("GET /api/articles/:article_id", () => {
    test("status 200 responds with requested article object", () => {
      return request(app)
        .get("/api/articles/3")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeInstanceOf(Array);
          expect(body.articles).toHaveLength(1);
          expect(body.articles[0].article_id).toEqual(3);
        });
    });
    test("status 400 responds with Invalid query msg object when passed an invalid article_id", () => {
      return request(app)
        .get("/api/articles/invalid")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid request.");
        });
    });
    test("status 404 responds with Article not found when passed an non existent article_id", () => {
      return request(app)
        .get("/api/articles/99")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Article not found.");
        });
    });
  });
  describe("PATCH /api/articles/:article_id", () => {
    test("status 200 returns updated article", () => {
      const updateArticle = {
        inc_votes: 50,
      };
      return request(app)
        .patch("/api/articles/3")
        .send(updateArticle)
        .expect(200)
        .then(({ body }) => {
          expect(body).toBeInstanceOf(Object);
          expect(body).toEqual({
            updatedArticle: {
              votes: 50,
              ...body.updatedArticle,
            },
          });
        });
    });
    test("status 404 returns article not found message", () => {
      return request(app)
        .patch("/api/articles/99")
        .expect(404)
        .then(({ body }) => {
          expect(body).toBeInstanceOf(Object);
          expect(body.msg).toBe("Article not found.");
        });
    });
  });
  describe("GET /api/articles/:article_id/comments", () => {
    test("status 200 responds with an article's comments", () => {
      return request(app)
        .get("/api/articles/3/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body).toBeInstanceOf(Object);
          expect(
            body.comments.forEach((comment) => {
              expect(comment).toBeInstanceOf(Object);
              expect(comment).toEqual(
                expect.objectContaining({
                  body: expect.any(String),
                  votes: expect.any(Number),
                  author: expect.any(String),
                  article_id: expect.any(Number),
                  comment_id: expect.any(Number),
                  created_at: expect.any(String),
                })
              );
            })
          );
        });
    });
    test("status 400 responds with invalid id", () => {
      return request(app)
        .get("/api/articles/not-id/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid request.");
        });
    });
    test("status 404 return article not found message", () => {
      return request(app)
        .get("/api/articles/99/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Article not found.");
        });
    });
    test("status 200, found article but no comments", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.msg).toBe("No comments on this article.");
        });
    });
  });
  describe("POST /api/articles/:article_id/comments", () => {
    test("status 201 responds with a new comment object", () => {
      const newComment = {
        body: "Blah blah blah gop26",
        author: "lurker",
      };
      return request(app)
        .post("/api/articles/3/comments")
        .send(newComment)
        .expect(201)
        .then(({ body }) => {
          expect(body).toBeInstanceOf(Object);
          expect(body.newComment).toEqual(
            expect.objectContaining({
              body: expect.any(String),
              votes: expect.any(Number),
              author: expect.any(String),
              article_id: expect.any(Number),
              created_at: expect.any(String),
            })
          );
        });
    });
    test("status 404 responds with article not found message", () => {
      const newComment = {
        body: "Blah blah blah gop26",
        author: "lurker",
      };
      return request(app)
        .post("/api/articles/99/comments")
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Article not found.");
        });
    });
    test("status 404 responds with Username doesn't exist", () => {
      const newComment = {
        body: "Blah blah blah gop26",
        author: "modern_doomsayer",
      };
      return request(app)
        .post("/api/articles/:article_id/comments")
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Username doesn't exist.");
        });
    });
    test("status 400 responds with Invalid id msg", () => {
      const newComment = {
        body: "Blah blah blah gop26",
        author: "lurker",
      };
      return request(app)
        .post("/api/articles/invalid-id/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid request.");
        });
    });
    test("status 400 responds with Missing required fields msg", () => {
      const newComment = { author: "rogersop" };
      return request(app)
        .post("/api/articles/:article_id/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Missing required field body.");
        });
    });
    test("status 400 responds with Missing required fields msg", () => {
      const newComment = { body: "We all gonna diiiie!" };
      return request(app)
        .post("/api/articles/:article_id/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Missing required field author.");
        });
    });
    test("status 400 responds with Missing required fields msg", () => {
      const newComment = {};
      return request(app)
        .post("/api/articles/:article_id/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Missing required field author and body.");
        });
    });
  });
  describe("DELETE /api/comments/:comment_id", () => {
    test("responds with status 204", () => {
      return request(app).delete("/api/comments/18").expect(204);
    });
  });
  describe("GET /api/users", () => {
    test("responds with status 200 and an array of users objects", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          expect(body.users).toBeInstanceOf(Array);
          expect(body.users).toHaveLength(4);
          body.users.forEach((user) => {
            expect(user).toEqual(
              expect.objectContaining({
                username: expect.any(String),
                avatar_url: expect.any(String),
                name: expect.any(String),
              })
            );
          });
        });
    });
  });
  describe("GET /api/users/:username", () => {
    test("respond with status 200 and a single user object", () => {
      return request(app)
        .get("/api/users/lurker")
        .expect(200)
        .then(({ body }) => {
          expect(body).toBeInstanceOf(Object);
          expect(body.user).toHaveLength(1);
          expect(body.user[0]).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              avatar_url: expect.any(String),
              name: expect.any(String),
            })
          );
        });
    });
  });
  describe("PATCH /api/comments/:comment_id", () => {
    test("status 200 returns updated article", () => {
      const updateComment = {
        inc_votes: 65,
      };
      return request(app)
        .patch("/api/comments/3")
        .send(updateComment)
        .expect(200)
        .then(({ body }) => {
          expect(body).toBeInstanceOf(Object);
          expect(body).toEqual({
            updatedComment: {
              votes: 65,
              ...body.updatedComment,
            },
          });
        });
    });
    test("return status 404 if comment not found", () => {
      return request(app)
        .patch("/api/comments/99")
        .expect(404)
        .then(({ body }) => {
          expect(body).toBeInstanceOf(Object);
          expect(body.msg).toBe("Comment not found");
        });
    });
  });
});
