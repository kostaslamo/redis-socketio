const express = require("express");
const http = require("http");
const cors = require("cors");

require("dotenv").config();

const { createSubscriber } = require("./services/redisSubscriber");

const port = 4000;
const app = express();

app.use(cors());

app.use(
  express.urlencoded({
    limit: "250mb",
    extended: true,
  })
);
app.use(express.json({ limit: "250mb" }));

const server = http.createServer(app);

const io = require("socket.io")(server);

app.use("/register", express.static(__dirname + "/register.html"));
app.use("/dependencies", express.static(__dirname + "/dependencies"));
app.use("/scripts", express.static(__dirname + "/scripts"));

server.listen(port, () => {
  console.log(`Handler server up and running on port ${port}`);
});

io.on("connection", (socket) => {
  console.log("Socket connected: ", socket.id);

  socket.emit("WELCOME", `Welcome User ${socket.id}`);

  // Join one or more rooms
  socket.on("joinRoom", ({ username, rooms }) => {
    console.log(`${username} joining room ${rooms}`);
    rooms.forEach((room) => {
      socket.join(room);
    });
  });

  socket.on("disconnect", () => {
    console.log("socket disconnectd", socket.id);
  });
});

createSubscriber().then((redisSubscriber) => {
  redisSubscriber.subscribe("general", (message) => {
    const msgObj = JSON.parse(message);
    console.log(message); // 'message'
    io.to("en-us").emit("roomMsg", msgObj);
  });
});

// Send message to each room
setInterval(() => {
  io.to("en-us").emit("roomMsg", "Your are in EN-US room");
  io.to("de").emit("roomMsg", "Your are in DE room");
  io.to("fr").emit("roomMsg", "Your are in FR room");
  io.to("es").emit("roomMsg", "Your are in ES room");
  io.to("gr").emit("roomMsg", "Your are in GR room");
}, 10000);
