module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "tsx", "js", "json", "jsx"],
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  testMatch: ["**/?(*.)+(spec|test).ts"],
};
