const http = require("http");
const { Server } = require("socket.io");

const port = 7070;
const host = "127.0.0.1";

const server = http.createServer();
const io = new Server(server);

const validApiKeys = ["1", "2"];

// Map to store connected clients (peers) by API key
let connectedClients = new Map();

// Middleware for API key validation and unique client identification
io.use((socket, next) => {
  const apiKey = socket.handshake.auth.apiKey;
  const computerId = socket.handshake.address; // Assuming this gives the client's IP address

  if (!apiKey || !validApiKeys.includes(apiKey)) {
    return next(new Error("Invalid API Key!"));
  }

  // Check if there is already an active client with the same API key
  if (connectedClients.has(apiKey)) {
    return next(
      new Error("Another client with this API key is already connected.")
    );
  }

  // Add the client to the map with their API key
  connectedClients.set(apiKey, {
    id: socket.id,
    computerId: computerId, // Store computer identifier for uniqueness
  });

  next();
});

// Event handler for new connections
io.on("connection", (socket) => {
  console.log(`\x1b[35m🐱 Connected:\x1b[0m ${socket.id}`); // Magenta color for "Connected" message

  // Event handler for receiving messages
  socket.on("message", handleMessage);

  // Event handler for client disconnect
  socket.on("disconnect", handleDisconnect);

  // Event handler for requesting available peers
  socket.on("getAvailablePeers", () => {
    const peerIds = Array.from(connectedClients.values())
      .filter((client) => client.id !== socket.id) // Exclude self from the list
      .map((client) => client.id);

    socket.emit("availablePeers", peerIds);
  });

  // Function to handle incoming messages
  function handleMessage(data) {
    console.log(`\x1b[35m📦 from ${socket.id}:\x1b[0m`, data); // Magenta color for "Message from" message

    // Broadcast message to all clients except the sender
    socket.broadcast.emit("message", {
      from: socket.id,
      message: data,
      timestamp: Date.now(),
    });
  }

  // Function to handle client disconnect
  function handleDisconnect() {
    console.log(`\x1b[35m😿 Disconnected:\x1b[0m ${socket.id}`); // Magenta color for "Disconnected" message

    // Remove client from the map
    connectedClients.forEach((value, key) => {
      if (value.id === socket.id) {
        connectedClients.delete(key);
      }
    });
  }
});

// Start the HTTP server
server.listen(port, host, () => {
  console.log(
    `\x1b[32m⚡ Ming Socket.io Server is running on ${host}:${port}\x1b[0m`
  ); // Green color for "Server is running" message
  console.log("🤝 Waiting for messages...\n");
});
