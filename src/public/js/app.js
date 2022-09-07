const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

form.addEventListener("submit", handleRoomSubmit);

let roomName;
let userName;

function showRoom() {
  room.hidden = false;
  welcome.hidden = true;

  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;

  const msgForm = room.querySelector("#msg");
  msgForm.addEventListener("submit", handleMessageSubmit);
}


function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#msg input");
  const value = input.value;
  socket.emit("new_message", input.value, roomName, () => {
    addMessage(`You: ${value}`);
  });
  input.value = "";
}
function handleRoomSubmit(event) {
  event.preventDefault();
  const roomInput = form.querySelector("#roomName");
  const nameInput = form.querySelector("#userName");
  socket.emit("enter_room", roomInput.value, nameInput.value, showRoom);
  roomName = roomInput.value;
  userName = nameInput.value;
  roomInput.value = "";
  userInput.value = "";
}

function addMessage(msg) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = msg;
  ul.appendChild(li);
}

socket.on("welcome", (user) => {
  addMessage(`${user} Joined!`);
})

socket.on("bye", (user) => {
  addMessage(`${user} Disconnect.`);
})

socket.on("new_message", addMessage);