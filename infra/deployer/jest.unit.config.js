module.exports = {
  testEnvironment: "node",

  testMatch: [
    "<rootDir>/build/tests/**/*.test.js",

    // Note: <rootDir> doesn't seem to work here (as of Jest 27):
    "!**/build/tests/integration/**",
  ],
  watchPathIgnorePatterns: ["<rootDir>/src/"],

  collectCoverage: true,
  collectCoverageFrom: [
    "<rootDir>/build/dist/**/*.js",
    "<rootDir>/build/tests/**/*.js",

    // Not covered by unit tests:
    "!<rootDir>/build/dist/ext/**",
    "!<rootDir>/build/dist/bin.js",
    "!<rootDir>/build/dist/index.js",
    "!<rootDir>/build/tests/integration/**",
  ],
  coverageDirectory: "<rootDir>/build/coverage/unit",
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
