const express = require("express");
const http = require("http");
const cors = require("cors");

require("dotenv").config();

const { createSubscriber } = require("./services/redisSubscriberV3");

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

  socket.emit("welcome", `Welcome User ${socket.id}`);

  // Join one or more rooms
  socket.on("joinRooms", ({ username, rooms }) => {
    console.log(`${username} joining room(s) ${rooms}`);
    rooms.forEach((room) => {
      socket.join(room);
    });
  });

  socket.on("leaveRooms", () => {
    const { rooms, id } = socket;
    const roomIds = Object.keys(rooms).filter((el, idx) => idx !== 0); // remove first element which is always sockets room
    if (roomIds.length > 0) {
      console.log(`${id} leaving room(s) ${roomIds}`);
      roomIds.forEach((room) => {
        socket.leave(room);
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("socket disconnectd", socket.id);
  });
});

createSubscriber((err, redisSubscriber) => {
  if (err) console.log(err.message);
  redisSubscriber.subscribe("general");

  redisSubscriber.on("message", (channel, message) => {
    if (channel === "general") {
      // Handle all messages that redis subscriber receives
      const msgObj = JSON.parse(message);
      // Check if the message should be emitted in a specific language group
      if (msgObj.data && msgObj.data.lang) {
        io.to(msgObj.data.lang).emit("roomMsg", msgObj);
      } else {
        io.emit("genericMessage", msgObj);
      }
    }
  });
});

// Send every 10 seconds a message to each room
setInterval(() => {
  io.to("en-us").emit("roomMsg", "Your are in EN-US room");
  io.to("de").emit("roomMsg", "Your are in DE room");
  io.to("fr").emit("roomMsg", "Your are in FR room");
  io.to("es").emit("roomMsg", "Your are in ES room");
  io.to("gr").emit("roomMsg", "Your are in GR room");
}, 10000);
