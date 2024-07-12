const io = require("socket.io-client");
const readline = require("readline");

const apiKey = "1"; // Replace with the actual API key you want to use
const serverUrl = "https://70c8-65-95-162-187.ngrok-free.app";
const socket = io(serverUrl, {
  auth: {
    apiKey,
  },
});

console.log("🔗 Connecting to Server...");
socket.on("connect", () => {
  console.log(`🤝 Connected to Ming Socket.io Server.`);

  // Listen for availablePeers event
  socket.on("availablePeers", (peerIds) => {
    console.log("\nAvailable Peers:");
    peerIds.forEach((peerId) => {
      console.log(`- ${peerId}`);
    });
  });

  // Listen for errorMessage event
  socket.on("errorMessage", (error) => {
    console.error("\nError:", error);
  });

  // Start sending messages
  sendMessageToServer();
});

socket.on("message", (data) => {
  if (data.from !== socket.id) {
    console.log("\nMessage received from server:", data);
  }
});

socket.on("connect_error", (error) => {
  console.error("Connection error:", error.message);
  console.log(
    "Failed to connect to server. Please check your network and try again."
  );
});

socket.on("disconnect", () => {
  console.log("\nDisconnected from Socket.io server");
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
