module.exports = {
  testEnvironment: "node",

  testMatch: [
    "<rootDir>/build/tests/**/*.test.js",

     // Note: <rootDir> doesn't seem to work here:
    "!**/build/tests/integration/**",
  ],

  collectCoverage: true,
  collectCoverageFrom: [
    "<rootDir>/build/dist/**/*.js",
    "<rootDir>/build/tests/**/*.js",

    // Only covered by integration tests:
    "!<rootDir>/build/tests/integration/**",
    "!<rootDir>/build/dist/ext/**",
    "!<rootDir>/build/dist/index.js",
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
