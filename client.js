/**
 * @author: Lexy <not.so.lexy@gmail.com, 13x54n>
 */
const io = require("socket.io-client");
const readline = require("readline");

const socket = io(`https://70c8-65-95-162-187.ngrok-free.app`);
console.log('🔗 Connecting to Server...')
socket.on("connect", () => {
  console.log(`🤝 Connected to Ming Socket.io Server.`);

  sendMessageToServer();
});

socket.on("message", (data) => {
  console.log("\nMessage received from server:", data);
});

function sendMessageToServer() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("Enter message to send to server: ", (message) => {
    socket.emit("message", message); // Send message to server
    rl.close();
    sendMessageToServer();
  });
}

// Event handler for disconnection from server
socket.on("disconnect", () => {
  console.log("\nDisconnected from Socket.io server");
});
