import { Deployer } from "./core/deployer";
import { realEnvironment } from "./ext/real-environment";

new Deployer(realEnvironment())
  .run(process.argv.slice(2))
  .then(exitCode => {
    process.exitCode = exitCode;
  })
  .catch(err => console.error(err));
