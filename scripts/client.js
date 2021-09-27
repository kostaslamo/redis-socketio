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
  addToMessages(`Welcome in ${selected.toString()} room(s)`);
});

document.getElementById("leave").addEventListener("click", async () => {
  socket.emit("leaveRooms");
  addToMessages("You left all Rooms");
});

function addToMessages(msg) {
  const tag = document.createElement("p");
  const text = document.createTextNode(msg);
  tag.appendChild(text);
  const element = document.getElementById("messages");
  element.appendChild(tag);
}

socket.on("welcome", (msg) => {
  console.log(msg);
  addToMessages(msg);
});

// Use "genericMessage" as a type for receiving messages that are broadcasted to everyone
socket.on("genericMessage", (msg) => {
  console.log(msg);
  addToMessages(msg);
});

// Use "roomMsg" as a type for receiving messages that are broadcasted only to a specific room
socket.on("roomMsg", (msg) => {
  console.log(msg);
  addToMessages(JSON.stringify(msg));
});
