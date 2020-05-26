/**
 * Suppress React 16.8 act() warnings globally.
 * The react teams fix won't be out of alpha until 16.9.0.
 * @see https://github.com/facebook/react/issues/14769
 */
const consoleError = console.error;
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation((...args) => {
    if (
      args[0] &&
      args[0].includes &&
      !args[0].includes(
        "Warning: An update to %s inside a test was not wrapped in act"
      )
    ) {
      consoleError(...args);
    }
  });
});

beforeEach(() => {
  document.body.innerHTML = "";
});
