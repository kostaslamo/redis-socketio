const apiUrl = "http://localhost:4000";

const socket = io();

document.getElementById("submit").addEventListener("click", async () => {
  const selected = [];
  for (var option of document.getElementById("languages").options) {
    if (option.selected) {
      selected.push(option.value);
    }
  }
  // firstly leave all rooms and then join selected
  socket.emit("leaveRooms");
  // socket.emit to join a room, as joining a room is implemented in server and socket.join('roomName') uses the socket object that is returned in the callback function of io.on('connection')
  socket.emit("joinRooms", { username: socket.id, rooms: selected });
});

document.getElementById("leave").addEventListener("click", async () => {
  // firstly leave all rooms and then join selected
  socket.emit("leaveRooms");
});

socket.on("WELCOME", (msg) => {
  console.log(msg);
});

// Use this type of message for all messages
socket.on("message", (msg) => {
  console.log(msg);
});

// Use this type of message for receiving messages from room(s) the client is registered to
socket.on("roomMsg", (msg) => {
  console.log(msg);
});
