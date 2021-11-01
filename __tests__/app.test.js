const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const { seed } = require("../db/seeds/seed.js");
const request = require("supertest");
const app = require("../app.js");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("nc-news app", () => {
  describe("testing testData object", () => {
    test("test testData object", () => {
      expect(testData).toMatchObject({
        articleData: expect.any(Array),
        commentData: expect.any(Array),
        topicData: expect.any(Array),
        userData: expect.any(Array),
      });
    });
  });
});
