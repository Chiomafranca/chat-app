const express = require("express");
const path = require("path");
const app = express();

const PORT = process.env.PORT || 4000;


const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


const io = require("socket.io")(server);


app.use(express.static(path.join(__dirname, "public")));


const socketsConnected = new Set();

io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);
    socketsConnected.add(socket.id);

  
    io.emit("clients-total", socketsConnected.size);


    socket.on("disconnect", () => {
        console.log(`Socket disconnected: ${socket.id}`);
        socketsConnected.delete(socket.id);
        io.emit("clients-total", socketsConnected.size);
    });


    socket.on("message", (data) => {
        console.log("Message received:", data);
        socket.broadcast.emit("chat-message", data);
    });

    socket.on('feedback', (data) =>{
        socket.broadcast.emit('feedback', data)
    })
});
