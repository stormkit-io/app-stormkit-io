module.exports = {
  testPathIgnorePatterns: ["tests/", "scripts/"],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|css)$":
      "<rootDir>/config/__mocks__/file-mock.js",
    "~/testing(.*)$": "<rootDir>/testing/$1",
    "~(.*)$": "<rootDir>/src/$1",
  },
  moduleDirectories: ["node_modules"],
  collectCoverageFrom: [
    "src/**/*.{js,jsx}",
    "!src/**/*.spec.{js,jsx}",
    "!**/node_modules/**",
  ],
  coverageDirectory: "coverage/",
  coverageReporters: ["html", "lcov"],
  testURL: "http://localhost",
  testMatch: ["**/?(*.)+(spec).[jt]s?(x)"],
  setupFilesAfterEnv: ["<rootDir>/testing/setup.js"],
  rootDir: "../",
  clearMocks: true,
  restoreMocks: true,
  resetMocks: true,
};
