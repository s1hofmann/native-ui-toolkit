module.exports = {
  collectCoverageFrom: [
    "index.ts",
    "lib/**/*.ts",
    "!lib/**/*.spec.ts",
    "!<rootDir>/node_modules/",
  ],
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: process.env.E2E_TEST ?
    ["**/__tests__/?(e2e)/**/*.[jt]s?(x)", "**/?(*.)?(e2e.)+(spec|test).[jt]s?(x)"] :
    ["**/__tests__/!(e2e)/**/*.[jt]s?(x)", "**/!(*.e2e.*)+(spec|test).[jt]s?(x)"],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/dist/",
  ],
};
