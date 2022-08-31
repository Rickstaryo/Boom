const messageList=document.querySelector("ul");
const messageForm=document.querySelector("form");
const frontSocket = new WebSocket(`ws://localhost:3000`);

// 1.Conecting 'Server' Browser to FrontEnd
frontSocket.addEventListener("open", ()=>{
    console.log("Connected to sever. ✔️")
});

// 2. Showing message on Console
frontSocket.addEventListener("message", (message)=>{
    console.log("New Message", message.data);
});

// 3. Closing the 'Server' Backend to FrontEnd 
frontSocket.addEventListener("close" ,()=>{
    console.log("DisConnected to sever. ")
});


function handleSubmit(event){
    event.preventDefault();
    const input= messageForm.querySelector("input");
    frontSocket.send(input.value);
    input.value="";

};


messageForm.addEventListener("submit",handleSubmit);