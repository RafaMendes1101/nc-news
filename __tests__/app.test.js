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
});
