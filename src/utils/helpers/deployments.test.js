import { nlToKeyValue } from "./deployments";

describe("(helpers)", () => {
  test("nlToKeyValue should split the env variables in a text box and return an object", () => {
    const vars = `
        NODE_ENV='production'
        API_DOMAIN=https://api.stormkit.io/path/?query=1#anchor
        PWD="sf$18'xv14$#1031=x=132"
      `;

    expect(nlToKeyValue(vars)).toEqual({
      NODE_ENV: "production",
      API_DOMAIN: "https://api.stormkit.io/path/?query=1#anchor",
      PWD: "sf$18'xv14$#1031=x=132"
    });
  });
});
