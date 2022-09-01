const messageList=document.querySelector("ul");
const nicknameForm=document.querySelector("#nick");
const messageForm=document.querySelector("#message");
const frontSocket = new WebSocket(`ws://localhost:3000`);

function makeMessage(type, payload) {
    const msg = { type, payload };
    return JSON.stringify(msg);
}


// 1.Conecting 'Server' Browser to FrontEnd
frontSocket.addEventListener("open", ()=>{
    console.log("Connected to sever. ✔️")
});

// 2. Showing message on Console
frontSocket.addEventListener("message", (message)=>{
    const li =  document.createElement("li");
    li.innerText= message.data;
    messageList.append(li);
});

// 3. Closing the 'Server' Backend to FrontEnd 
frontSocket.addEventListener("close" ,()=>{
    console.log("DisConnected to sever. ")
});


function handleSubmit(event){
    event.preventDefault();
    const input= messageForm.querySelector("input");
    frontSocket.send(makeMessage("new_Message",input.value));
    input.value="";
}
function handleNickSubmit(event) {
    event.preventDefault();
    const input = nicknameForm.querySelector("input");
    frontSocket.send(makeMessage("nickname", input.value));
}

messageForm.addEventListener("submit", handleSubmit);
nicknameForm.addEventListener("submit", handleNickSubmit);