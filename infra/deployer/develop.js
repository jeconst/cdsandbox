const path = require("path");

const ts = require("typescript");

function main() {
  const tsConfigPath = path.resolve("tsconfig.json")

  const host = ts.createWatchCompilerHost(
    tsConfigPath,
    {},
    ts.sys,
    ts.createSemanticDiagnosticsBuilderProgram,
    reportDiagnostic,
    reportWatchStatusChanged,
  );

  ts.createWatchProgram(host);
}

function reportDiagnostic(diagnostic) {
  console.log("diagnostic", diagnostic);
}

function reportWatchStatusChanged(diagnostic) {
  console.log("watchStatusChanged", diagnostic);
}

main();
