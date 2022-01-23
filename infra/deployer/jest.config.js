module.exports = {
  testMatch: ["<rootDir>/build/**/*.test.js"],
  testEnvironment: "node",

  watchPathIgnorePatterns: ["^<rootDir>/src"],

  collectCoverage: false,
  collectCoverageFrom: [
    "build/**/*.js",
    "!build/coverage/**",
  ],
  coverageDirectory: "build/coverage",
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
