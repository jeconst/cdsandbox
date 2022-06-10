module.exports = {
  testEnvironment: "node",

  testMatch: ["<rootDir>/build/tests/**/*.test.js"],
  watchPathIgnorePatterns: ["<rootDir>/src/"],

  collectCoverage: true,
  collectCoverageFrom: [
    "<rootDir>/build/dist/**/*.js",
    "<rootDir>/build/tests/**/*.js",

    // Coverage not picked up since Jest doesn't support coverage for subprocesses:
    // https://github.com/facebook/jest/issues/5274
    "!<rootDir>/build/dist/bin.js",
    "!<rootDir>/build/dist/index.js",
    "!<rootDir>/build/dist/ext/system-host.js",
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
