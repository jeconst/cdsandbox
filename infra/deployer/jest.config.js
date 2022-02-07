module.exports = {
  testMatch: ["<rootDir>/build/**/*.test.js"],
  testEnvironment: "node",

  watchPathIgnorePatterns: ["^<rootDir>/src"],

  collectCoverage: false,
  collectCoverageFrom: [
    "build/dist/**/*.js",
    "build/tests/**/*.js",

    // Only covered by E2E tests:
    "!build/dist/ext/**/*.js",
    "!build/dist/index.js",
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
