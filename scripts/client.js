const apiUrl = "http://localhost:4000";

const socket = io();

async function postData(path = "", data = {}) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  // Default options are marked with *
  const body = JSON.stringify(data);
  const reqOptions = {
    method: "POST",
    headers: myHeaders,
    body,
    redirect: "follow",
  };
  const response = await fetch(`${apiUrl}/${path}`, reqOptions);
  return response.json(); // parses JSON response into native JavaScript objects
}

document.getElementById("submit").addEventListener("click", async () => {
  const selected = [];
  for (var option of document.getElementById("languages").options) {
    if (option.selected) {
      selected.push(option.value);
    }
  }
  // socket.emit to join a room, as joining a room is implemented in server and socket.join('roomName') uses the socket object that is returned in the callback function of io.on('connection')
  socket.emit("joinRoom", { username: socket.id, rooms: selected });
});

socket.on("WELCOME", (msg) => {
  console.log(msg);
});

socket.on("message", (msg) => {
  console.log(msg);
});

socket.on("roomMsg", (msg) => {
  console.log(msg);
});
