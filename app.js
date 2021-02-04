const http = require("http");
const stoppable = require("stoppable");
const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

const forceCloseAfter = 5000; // milliseconds
const server = stoppable(http.createServer(app), forceCloseAfter);

["SIGTERM", "SIGINT"].forEach(signal => {
  process.on(signal, () => {
    console.log(`\nReceived ${signal}, exiting...`);
    server.stop();
  });
});

const hostname = "0.0.0.0";
const port = 80;

server.listen(port, hostname, () => {
  console.log(`Listening at http://${hostname}:${port}/`);
});
