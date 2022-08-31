import { capitalize, parseBoolean, booleanToString, truncate } from "./string";

describe("utils/helpers/string", () => {
  test.skip("capitalize", () => {
    expect(capitalize("my string")).toBe("My string");
    expect(capitalize()).toBe("");
  });

  test.skip("parseBoolean", () => {
    expect(parseBoolean("true")).toBe(true);
    expect(parseBoolean("false")).toBe(false);
    expect(parseBoolean("")).toBeUndefined();
  });

  test.skip("booleanToString", () => {
    expect(booleanToString(true)).toBe("true");
    expect(booleanToString(false)).toBe("false");
    expect(booleanToString()).toBe("");
  });

  test.skip("truncate", () => {
    expect(truncate("hello world", 6)).toBe("hello...");
  });
});
