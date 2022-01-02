import fs from "fs";
import { Deployer } from "./deployer";

new Deployer()
  .run(process.argv.slice(2))
  .then(exitCode => {
    process.exitCode = exitCode;
  });
