const io = require("socket.io-client");
const readline = require("readline");
const os = require("os");

const apiKey = "1"; // Replace with the actual API key you want to use
const serverUrl = "https://70c8-65-95-162-187.ngrok-free.app";
const socket = io(serverUrl, {
  auth: {
    apiKey,
  },
});

// Function to set text color using ANSI escape codes
const setColor = (color, text) => `\x1b[${color}m${text}\x1b[0m`;

// Get unique identifier for this computer (using device MAC address and API key)
let deviceIdentifier = `node-${apiKey}`;

// Use the first non-internal IPv4 address as device identifier
const networkInterfaces = os.networkInterfaces();
Object.keys(networkInterfaces).forEach((iface) => {
  const networkInterface = networkInterfaces[iface];
  if (
    networkInterface &&
    networkInterface.length > 0 &&
    !networkInterface[0].internal &&
    networkInterface[0].mac
  ) {
    deviceIdentifier = `${networkInterface[0].mac}-${apiKey}`;
  }
});

console.log(setColor("33", "🔗 Connecting to Server...")); // Yellow color for "Connecting to Server" message

let isConnected = false;

socket.on("connect", () => {
  if (isConnected) {
    console.log(
      setColor("31", "Already connected from this device. Exiting...")
    );
    process.exit(0); // Exit if already connected
  }

  console.log(setColor("32", "🤝 Connected to Ming Socket.io Server.")); // Green color for "Connected to Server" message
  isConnected = true; // Set connection flag

  // Listen for availablePeers event
  socket.on("availablePeers", (peerIds) => {
    console.log(setColor("36", "\nAvailable Peers:")); // Cyan color for "Available Peers" message
    peerIds.forEach((peerId) => {
      console.log(setColor("36", `- ${peerId}`)); // Cyan color for peer IDs
    });
    sendMessageToServer();
  });

  // Listen for errorMessage event
  socket.on("errorMessage", (error) => {
    console.error(setColor("31", "\nError:"), error); // Red color for error messages
    process.exit(0);
  });

  // Listen for incoming messages
  socket.on("message", (data) => {
    if (data.from !== socket.id) {
      console.log(`\x1b[35m📦 from ${data.from}:\x1b[0m`, data.message); // Magenta color for "Message from" message
      closeOldReadline();
    }
  });

  // Handle connection errors
  socket.on("connect_error", (error) => {
    console.error(setColor("31", "Connection error:"), error.message); // Red color for connection error messages
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    isConnected = false; // Reset connection flag on disconnect
    console.log(setColor("33", "\nDisconnected from Socket.io server")); // Yellow color for "Disconnected from Server" message
  });

  // Initial request for available peers after connecting
  socket.emit("getAvailablePeers");
});

let rl;

function sendMessageToServer() {
  rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question(setColor("32", "\nMing: "), (message) => {
    if (message.trim().toLowerCase() === "exit") {
      rl.close();
      process.exit(); // Exit the process if the user types "exit"
    } else {
      socket.emit("message", message); // Send message to server
      rl.close();
    }
  });

  // Handle interruption (CTRL+C) to ensure readline interface is properly closed
  rl.on("SIGINT", () => {
    rl.question("\nAre you sure you want to exit? (yes/no) ", (answer) => {
      if (answer.match(/^y(es)?$/i)) {
        rl.close();
        process.exit(); // Exit the process if the user confirms
      } else {
        process.stdout.write(setColor("32", "\nMing: "));
      }
    });
  });
}

function closeOldReadline() {
  if (rl) {
    rl.close();
    rl = null;
    sendMessageToServer();
  } else {
    callback();
  }
}
