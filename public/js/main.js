const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

// Using library calls Qs to extract the query search
const { username, room } = Qs.parse(location.search, {
    // ignore query symbols on searchbar
    ignoreQueryPrefix: true
});

const socket = io();

// Join chatroom
socket.emit("joinRoom", { username, room });

// Get room and users
socket.on("roomUsers", ({ room, users }) => {
    outputRoomAndUsers(room, users);
});

// Handle message from server
socket.on("message", message => {
    console.log(message);
    outputMessage(message);

    // Scroll down whenever message is sent
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

// Message submit
chatForm.addEventListener("submit", e => {
    // prevent defalut behaviour which is submit to a file
    e.preventDefault();

    const msg = e.target.elements.msg.value;

    // Send message to sever
    socket.emit("chatMessage", msg);

    // Clear input after sent message
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
})

// Output message to chat room
function outputMessage(message) {
    const div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML = `
    <p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>
    `;
    chatMessages.appendChild(div);
}


function outputRoomAndUsers(room, users) {
    roomName.innerText = room;
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join()}
    `;
}