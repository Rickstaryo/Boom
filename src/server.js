import http from "http";
import { WebSocketServer } from 'ws'
import express from "express";
import { Socket } from "dgram";


const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname+"/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log("Listening on http://localhost:3000");

// this is http server
const server = http.createServer(app);
// web socket Server 
const wss = new WebSocketServer({ server });

function onSocketClose(){
    console.log("DisConnected From the Browser");
}
//0. Message save Container
const messageSockets=[];


wss.on("connection", (backSocket) => {
    messageSockets.push(backSocket);
    backSocket["nickname"] = "Anon";
    console.log("Connected to Browser ✅");
    backSocket.on("close", onSocketClose);
    backSocket.on("message", (msg) => {
        const message = JSON.parse(msg);
        switch (message.type) {
            case "new_message":
            messageSockets.forEach((aSocket) =>
                aSocket.send(`${backSocket.nickname}: ${message.payload}`)
            );
            break;
            case "nickname":
            backSocket["nickname"] = message.payload;
            break;
        }
        });
});   



server.listen(3000, handleListen);



// wss.on("connection",(backSocket)=>{
//     // 1. When Chrombrowser sending  a message this message sockets receiving the backsockets
//     messageSockets.push(backSocket);
//     backSocket["nickname"] ="Anon";
//     console.log("We got connected to Browser");
//     backSocket.on("close", onSocketClose);
//     // 2. Using Foreach to every single time saved message sending to each different Browser.
//     backSocket.on("message",(message)=> {
//         const messageString = message.toString("utf-8"); 
//         const parsed = JSON.parse(messageString);
//         switch(messageString.type){
//             case "new_message":
//                 messageSockets.forEach(aSocket => aSocket.send(`${backSocket.nicknmame}: ${messageString.payload}`))
//             break;
//             // puting nickname to Socket 
//             case "nickname":
//                 backSocket["nicknmame"]=message.payload;
//             break;   
//         }
//     })
// });
// server.listen(3000, handleListen);
