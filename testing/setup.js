import "isomorphic-fetch";
import nock from "nock";
import { JSDOM } from "jsdom";

process.env.API_DOMAIN = "http://localhost";

beforeEach(() => {
  global.document = new JSDOM(`<!DOCTYPE html><body></body>`);
});

afterEach(() => {
  delete global.__MOCK_PROPS__;
  jest.clearAllMocks();
  jest.restoreAllMocks();
  nock.cleanAll();
});
