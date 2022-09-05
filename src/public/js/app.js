const socket = io();
const welcome = document.getElementById("welcome");
const form =welcome.querySelector("form");
const room = document.getElementById("room");

let roomName; 
room.hidden = true;


// To hide form and show up room
function showRoom(){
    welcome.hidden =true;
    room.hidden=false;
    const h3 = room.querySelector("h3");
    h3.innerHTML=`Room ${roomName}`;
}

function backendDone(msg) {
    console.log(`The backend says: `, msg);
  }
  

function handleRoomSubmit(event){
    event.preventDefault();
    const input = form.querySelector("input");
    socket.emit("enter_room", input.value, showRoom);
    roomName= input.value;
    input.value=""
}

form.addEventListener("submit", handleRoomSubmit);