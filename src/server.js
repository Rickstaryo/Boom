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



