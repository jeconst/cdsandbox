import { readFileSync } from "fs";

export type Config = {
  appName: string;
};

export function readConfig(): Config {
  const configJson = readFileSync("/infrah/config.json", { encoding: "utf-8" });

  // FIXME: This is unsound and allows type errors with undefined. Can eslint prevent this?
  return JSON.parse(configJson);
}
