const express = require("express");
const http = require("http");
const cors = require("cors");

require("dotenv").config();

const { createPublisher } = require("./services/redisPublisherV3");

let redisPublisher;

createPublisher((err, pub) => {
  if (err) console.log(err.message);
  redisPublisher = pub;
});

const port = 5000;
const app = express();

app.use(cors());

app.use(
  express.urlencoded({
    limit: "250mb",
    extended: true,
  })
);
app.use(express.json({ limit: "250mb" }));

app.post("/pubMessage", (req, res) => {
  const msg = JSON.stringify(req.body);
  // Publish to redis channel "general" a stringified object
  redisPublisher.publish("general", msg);
  res.sendStatus(200);
});

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Handler server up and running on port ${port}`);
});
