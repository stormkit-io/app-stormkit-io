import { capitalize } from "./string";

describe("utils/helpers/string", () => {
  test("capitalize", () => {
    expect(capitalize("my string")).toBe("My string");
    expect(capitalize()).toBe("");
  });
});
