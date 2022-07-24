const { spawn } = require("child_process");
const path = require("path");

const ts = require("typescript");

function main() {
  const tsConfigPath = path.resolve("tsconfig.json");

  const host = ts.createWatchCompilerHost(
    tsConfigPath,
    {},
    ts.sys,
    ts.createEmitAndSemanticDiagnosticsBuilderProgram,
    handleDiagnostic,
    handleDiagnostic,
  );

  ts.createWatchProgram(host);
}

const BEGIN_CODES = [6031, 6032];
const END_CODES = [6193, 6194];

let errors;

function handleDiagnostic(diagnostic) {
  if (BEGIN_CODES.includes(diagnostic.code)) {
    process.stdout.write("\n-----------------------------------------------------------------\n\n");
    errors = [];
  } else if (END_CODES.includes(diagnostic.code)) {
    if (errors.length === 0) {
      process.stdout.write("TypeScript: OK\n");

      const npm = spawn("npm", ["run", "test"], { stdio: "inherit" });
      npm.on("close", code => {
        console.log(`jest exited with code ${code}`);
      });
      npm.on("error", err => {
        console.log(`Tests failed: ${err}`);
      });
    } else {
      process.stdout.write("\nTypeScript: failed\n");
    }
  } else {
    const formatDiagnosticHost = {
      getCanonicalFileName: path => path,
      getCurrentDirectory: ts.sys.getCurrentDirectory,
      getNewLine: () => ts.sys.newLine,
    };

    process.stdout.write(ts.formatDiagnostic(diagnostic, formatDiagnosticHost));
    errors.push(diagnostic);
  }
}

main();
