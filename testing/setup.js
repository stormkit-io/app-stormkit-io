import "isomorphic-fetch";
import nock from "nock";
import { JSDOM } from "jsdom";

process.env.API_DOMAIN = "http://localhost";

class MockDate extends Date {
  /**
   * Mock the function and return always the ISO 8601 format for tests.
   */
  toLocaleDateString() {
    return (
      this.getFullYear() +
      "-" +
      ("0" + (this.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + this.getDate()).slice(-2)
    );
  }
}

global.Date = MockDate;

beforeEach(() => {
  global.document = new JSDOM(`<!DOCTYPE html><body></body>`);
});

afterEach(() => {
  delete global.__MOCK_PROPS__;
  jest.clearAllMocks();
  jest.restoreAllMocks();
  nock.cleanAll();
});
