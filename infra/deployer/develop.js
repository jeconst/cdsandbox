const path = require("path");

const ts = require("typescript");

function main() {
  const tsConfigPath = path.resolve("tsconfig.json");

  const host = ts.createWatchCompilerHost(
    tsConfigPath,
    {},
    ts.sys,
    ts.createSemanticDiagnosticsBuilderProgram,
    reportDiagnostic,
    reportDiagnostic,
  );

  ts.createWatchProgram(host);
}

function reportDiagnostic(diagnostic) {
  const formatDiagnosticHost = {
    getCanonicalFileName: path => path,
    getCurrentDirectory: ts.sys.getCurrentDirectory,
    getNewLine: () => ts.sys.newLine,
  };

  process.stdout.write(ts.formatDiagnostic(diagnostic, formatDiagnosticHost));
}

main();
