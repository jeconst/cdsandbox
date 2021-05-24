const http = require("http");
const stoppable = require("stoppable");
const express = require("express");

const app = express();

app.get("/", (req, res) => {
  userAgent = req.headers["user-agent"]
  console.log(`Received request from ${userAgent}`);
  res.send(`
    <h1>Hello, World!</h1>
    <p>It is currently ${Date()}</p>
    <p>Updated: 2021-05-24</p>
  `);
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
