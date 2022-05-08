#!/usr/bin/env node

import { runProgram } from "./index";

runProgram(process.argv.slice(2))
  .then(exitCode => {
    process.exitCode = exitCode;
  })
  .catch(err => {
    process.exitCode = 2;
    console.error("Unexpected error!");
    console.error(err);
  });
