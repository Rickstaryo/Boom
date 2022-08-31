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

wss.on("connection",(backSocket)=>{
    //1. Registering a listener When Browser Connect to server
    console.log("We got connected to Browser");

    //2.  Registering a listener When Browser Disconncet to Server
    backSocket.on("close", ()=>{
        console.log("Disconnected from Browser")
    });
    // 3. Resgistering if fronend send a message to backEnd 
    backSocket.on("message",(message)=>{
        console.log(message.toString('utf8'));
    });
    // 4. Sending a message to frontend 
    backSocket.send("hello!!");
});

server.listen(3000, handleListen);