const users = [];

// Join user to chat
function userJoin(id, username, room) {
    const user = { id, username, room };

    users.push(user);

    return user;
}

// Get current user
function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

// Handle if user leaves room
function userLeave(id) {
    const index = users.findIndex(user => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

// Get all users in room
function getRoomUsers(room) {
    return users.filter(user => user.room === room);
}

// Export these function
module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
}