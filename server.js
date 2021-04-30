const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, "public")));


const botName = "Bao but it's a Bot";

// Run when client connects
io.on("connection", socket => {
    // When user joins room
    socket.on("joinRoom", ({ username, room }) => {
        const user = userJoin(socket.id, username, room);

        // Join specific room
        socket.join(user.room);

        // Send message to the client that connect
        socket.emit("message", formatMessage(botName, 'Welcome to chatcord!'));

        // Send message to all the clients except the client that is already connnecting
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chat`));

        // Send users and room info
        io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

    // Handle chat message
    socket.on("chatMessage", msg => {
        const user = getCurrentUser(socket.id);
        // send message to all clients
        io.to(user.room).emit("message", formatMessage(user.username, msg));
    });

    // Handle disconnect
    socket.on("disconnect", () => {
        const user = userLeave(socket.id);
        if (user) {
            io.to(user.room).emit("message", formatMessage(botName, `${user.username} has left the chat`));

            // Send users and room info
            io.to(user.room).emit("roomUsers", {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    });
})

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));