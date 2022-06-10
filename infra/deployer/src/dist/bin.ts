#!/usr/bin/env node

import { run } from "./index";

run()
  .then(exitCode => {
    process.exitCode = exitCode;
  })
  .catch(err => {
    process.exitCode = 2;
    console.error("Unexpected error!");
    console.error(err);
  });
