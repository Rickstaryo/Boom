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

wss.on("connection",(backSocket)=>{
    // 1. When Chrombrowser sending  a message this message sockets receiving the backsockets
    messageSockets.push(backSocket);
    console.log("We got connected to Browser");
    backSocket.on("close", onSocketClose);
    // 2. Using Foreach to every single time saved message sending to each different Browser.
    backSocket.on("message",(message)=> {
        const messageString = message.toString('utf8');
        messageSockets.forEach(aSocket => aSocket.send(messageString));
    })
});

server.listen(3000, handleListen);

{
    type:"message";
    payload:"hello everyone!";
}
{
    type:"nickname";
    payload:"ricky";
}