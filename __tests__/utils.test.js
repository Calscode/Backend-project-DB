const {
  convertTimestampToDate,
  referenceObject
} = require("../db/seeds/utils");

describe("convertTimestampToDate", () => {
  test("returns a new object", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result).not.toBe(input);
    expect(result).toBeObject();
  });
  test("converts a created_at property to a date", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result.created_at).toBeDate();
    expect(result.created_at).toEqual(new Date(timestamp));
  });
  test("does not mutate the input", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    convertTimestampToDate(input);
    const control = { created_at: timestamp };
    expect(input).toEqual(control);
  });
  test("ignores includes any other key-value-pairs in returned object", () => {
    const input = { created_at: 0, key1: true, key2: 1 };
    const result = convertTimestampToDate(input);
    expect(result.key1).toBe(true);
    expect(result.key2).toBe(1);
  });
  test("returns unchanged object if no created_at property", () => {
    const input = { key: "value" };
    const result = convertTimestampToDate(input);
    const expected = { key: "value" };
    expect(result).toEqual(expected);
  });
  test("returns an object with article title as key and article id as the value when passed an article with one object", () => {
    const input = [{
      article_id: 1,
      title: "Living in the shadow of a great man",
      topic: "mitch",
      author: "butter_bridge",
      body: "I find this existance challenging",
      created_at: "2020-07-09T20:11:00:000Z",
      votes: 100,
      article_img_url: "https://images.pexels.com/photos"
    }]
    const result = referenceObject(input)
    expect(result).toEqual({
      "Living in the shadow of a great man" : 1
    })
  })
  test("returns an object with the article titles as the keys and the article ids as the values when passed an array containing multiple objects", () => {
    const input = [{
      article_id: 1,
      title: "Living in the shadow of a great man",
      topic: "mitch",
      author: "butter_bridge",
      body: "I find this existance challenging",
      created_at: "2020-07-09T20:11:00.000Z",
      votes: 100,
      article_img_url: "https://images.pexels.com/photos"
    }]
    const result = referenceObject(input)
    expect(result).toEqual({"Living in the shadow of a great man" : 1})
  })
});

