module.exports = {
  testEnvironment: "node",

  testMatch: ["<rootDir>/build/tests/**/*.test.js"],
  watchPathIgnorePatterns: ["<rootDir>/src/"],

  collectCoverage: true,
  collectCoverageFrom: [
    "<rootDir>/build/dist/**/*.js",
    "<rootDir>/build/tests/**/*.js",
  ],
  coverageDirectory: "<rootDir>/build/coverage/all",
  coverageReporters: ["clover", "json", "lcov", ["text", { skipFull: true }]],
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100,
    },
  },
};
