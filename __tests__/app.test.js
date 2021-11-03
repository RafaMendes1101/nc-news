const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const app = require("../app.js");

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
    test("status 400 responds with article not found msg object when passed an invalid article_id", () => {
      return request(app)
        .get("/api/articles/invalid")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Article not found");
        });
    });
  });
  describe("PATCH /api/articles/:article_id", () => {
    test("status 200 returns updated article", () => {
      const updateArticle = {
        title: "Updated title",
        author: "rogersop",
      };
      return request(app)
        .patch("/api/articles/1")
        .send(updateArticle)
        .expect(200)
        .then(({ body }) => {
          expect(body).toBeInstanceOf(Object);
          expect(body).toEqual({
            updatedArticle: {
              title: "Updated title",
              author: "rogersop",
              ...body.updatedArticle,
            },
          });
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
  });
  describe.only("POST /api/articles/:article_id/comments", () => {
    test("status 201 responds with a new comment object", () => {
      const newComment = {
        body: "Blah blah blah gop26",
        votes: 100,
        author: "lurker",
        article_id: 3,
      };
      return request(app)
        .post("/api/articles/3/comments")
        .send(newComment)
        .expect(201)
        .then(({ body }) => {
          console.log(body);
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
  });
});
