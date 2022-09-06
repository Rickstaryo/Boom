import http from "http";
import SocketIO from "socket.io";
import express from "express";
import { Socket } from "dgram";


const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname+"/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));



// this is http server
const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);


wsServer.on("connection", (socket) => {
    // If people didn't put nickname entering room 
    socket["nickname"]= "Anon"
    socket.onAny((event)=>{
        console.log(`Socket events:${event}`)
    })
    socket.on("enter_room", (roomName, done) => {
            socket.join(roomName);
            done();
            socket.to(roomName).emit("welcome", socket.nickname);
        })
    // Disconnecting 
    socket.on("disconnecting", ()=> {
        socket.rooms.forEach(room =>{ socket.to(room).emit("bye", socket.nickname);
            
        });
    })
    // Sending a msg to Backend
    socket.on("new_message", (msg, room, done) => {
        socket.to(room).emit("new_message", `${socket.nickname} : ${msg}`);
        done();
    })
    socket.on("nickname", (nickname)=> (socket["nickname"]=nickname))
});


const handleListen = () => console.log(`Listening on http://localhost:3000`);
httpServer.listen(3000, handleListen);





//Comparing the Socket.IO
// const handleListen = () => console.log("Listening on http://localhost:3000");
// // web socket Server 
// const wss = new WebSocketServer({ server });

// function onSocketClose(){
    //     console.log("DisConnected From the Browser");
// }
// //0. Message save Container
// const messageSockets=[];


// wss.on("connection", (backSocket) => {
//     messageSockets.push(backSocket);
//     backSocket["nickname"] = "Anon";
//     console.log("Connected to Browser ✅");
//     backSocket.on("close", onSocketClose);
//     backSocket.on("message", (msg) => {
//         const message = JSON.parse(msg);
//         switch (message.type) {
//             case "new_message":
//             messageSockets.forEach((aSocket) =>
//                 aSocket.send(`${backSocket.nickname}: ${message.payload}`)
//             );
//             break;
//             case "nickname":
//             backSocket["nickname"] = message.payload;
//             break;
//         }
//         });
// });   





