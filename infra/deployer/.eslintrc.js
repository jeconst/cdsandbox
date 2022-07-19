const fs = require("fs");

module.exports = {
  root: true,
  plugins: [
    "@typescript-eslint",
    "import",
  ],

  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
  },

  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
  ],

  env: {
    node: true,
    es6: true,
  },

  ignorePatterns: fs.readFileSync(".gitignore", "utf8").split("\n").filter(Boolean),

  rules: {
    "array-bracket-spacing": ["warn", "never"],
    "array-element-newline": "off",
    "arrow-parens": ["warn", "as-needed"],
    "block-spacing": ["warn", "never"],
    "brace-style": "warn",
    "camelcase": "warn",
    "comma-dangle": ["warn", "always-multiline"],
    "comma-spacing": "warn",
    "comma-style": "warn",
    "computed-property-spacing": "warn",
    "constructor-super": "error",
    "curly": ["warn", "multi-line"],
    "dot-location": ["warn", "property"],
    "eol-last": "error",
    "func-call-spacing": "warn",
    "generator-star-spacing": ["warn", "after"],
    "guard-for-in": "error",
    "indent": "off", // Use below TypeScript version instead
    "key-spacing": "warn",
    "keyword-spacing": "warn",
    "linebreak-style": "error",
    "max-len": ["error", { code: 120, ignoreUrls: true, ignoreTemplateLiterals: true }],
    "max-statements-per-line": "warn",
    "new-cap": "warn",
    "no-array-constructor": "error",
    "no-caller": "error",
    "no-empty": "warn",
    "no-extend-native": "error",
    "no-extra-bind": "error",
    "no-invalid-this": "error",
    "no-irregular-whitespace": "warn",
    "no-mixed-spaces-and-tabs": "error",
    "no-multi-spaces": "warn",
    "no-multi-str": "error",
    "no-multiple-empty-lines": ["warn", { max: 1, maxBOF: 0, maxEOF: 0 }],
    "no-new-object": "error",
    "no-new-symbol": "error",
    "no-new-wrappers": "error",
    "no-tabs": "error",
    "no-this-before-super": "error",
    "no-throw-literal": "error",
    "no-trailing-spaces": "warn",
    "no-unused-vars": "off", // Use below TypeScript version instead
    "no-var": "error",
    "no-with": "error",
    "object-curly-spacing": ["warn", "always"],
    "one-var": ["warn", "never"],
    "operator-linebreak": ["warn", "after"],
    "padded-blocks": ["warn", "never"],
    "prefer-const": ["warn", { destructuring: "all" }],
    "prefer-promise-reject-errors": "error",
    "prefer-rest-params": "error",
    "prefer-spread": "error",
    "quote-props": ["warn", "consistent"],
    "quotes": ["warn", "double", { avoidEscape: true }],
    "rest-spread-spacing": "warn",
    "semi": "warn",
    "semi-spacing": "warn",
    "space-before-blocks": "warn",
    "space-before-function-paren": ["warn", { asyncArrow: "always", anonymous: "never", named: "never" }],
    "spaced-comment": ["warn", "always"],
    "switch-colon-spacing": "warn",
    "yield-star-spacing": ["warn", "after"],

    "@typescript-eslint/ban-types": [
      "error",
      {
        extendDefaults: false,
        types: {
          // Modified defaults from https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/ban-types.md
          "String": { message: "Use string instead", fixWith: "string" },
          "Boolean": { message: "Use boolean instead", fixWith: "boolean" },
          "Number": { message: "Use number instead", fixWith: "number" },
          "Symbol": { message: "Use symbol instead", fixWith: "symbol" },
          "Function": { message: "Use specific function type instead" },
          "Object": { message: "Consider `Record<string, unknown>`, `object`, or `unknown` instead" },
          "{}": { message: "Consider `Record<string, unknown>`, `object`, or `unknown` instead" },
        },
      },
    ],

    "@typescript-eslint/indent": ["warn", 2, { "SwitchCase": 1 }],
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/no-inferrable-types": "warn",
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/no-empty-function": "warn",
    "@typescript-eslint/member-delimiter-style": [
      "warn",
      {
        "multiline": {
          "delimiter": "semi",
          "requireLast": true,
        },
        "singleline": {
          "delimiter": "comma",
          "requireLast": false,
        },
      },
    ],

    "import/no-duplicates": "warn",
    "import/order": ["warn", {
      "alphabetize": { order: "asc" },
      "newlines-between": "always",
    }],
  },

  overrides: [
    {
      files: [".eslintrc.js", "develop.js", "jest.config.js", "jest.unit.config.js"],
      parserOptions: {
        project: null,
      },
      rules: {
        "@typescript-eslint/no-floating-promises": "off",
        "@typescript-eslint/no-var-requires": "off",
      },
    },
    {
      files: ["src/tests/**/*"],
      plugins: ["jest"],
      extends: ["plugin:jest/recommended"],
      rules: {
        "jest/expect-expect": ["warn", { "assertFunctionNames": ["expect", "expectError", "lab.testProgram"] }],
      },
      overrides: [
        {
          files: ["src/tests/support/core-test-lab.ts"],
          rules: {
            "jest/no-standalone-expect": "off",
          },
        },
      ],
    },
  ],
};
