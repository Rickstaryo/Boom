const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName;
function handleMessageSubmit(event){
    event.preventDefault();
    const input = room.querySelector("#message input");
    const value = input.value;
    socket.emit("new_message", input.value,roomName,()=>{
        addMessage(`You: ${value}`);
    });
    input.value=""
}
// Nickname submit

function hanldeNicknameSubmit(event){
    event.preventDefault();
    const input = room.querySelector("#name input");
    const value = input.value;
    socket.emit("nickname", input.value);
}


function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;
  const msgForm = room.querySelector("#message");
  const nameForm = room.querySelector("#name")
 msgForm.addEventListener("submit", handleMessageSubmit);
 nameForm.addEventListener("submit",hanldeNicknameSubmit);
}

function handleRoomSubmit(event) {
    event.preventDefault();
    const input = form.querySelector("input");
    socket.emit("enter_room", input.value, showRoom);
    roomName = input.value;
    input.value = "";
  }
  

// Show a message when you enter the room 
function addMessage(message){
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = message;
    ul.appendChild(li);
};

socket.on("welcome",(user)=>{
    addMessage(`${user} arrived!`);
});
// FE About Disconnect
socket.on("bye",(left) =>{
    addMessage(`${left} left!`);
})

// Recieving a msg from BE to FE
socket.on("new_message", addMessage);

form.addEventListener("submit", handleRoomSubmit);