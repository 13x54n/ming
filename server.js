const http = require("http");
const io = require("socket.io");

const port = 7070;
const host = "127.0.0.1";

const server = http.createServer();
const socketServer = io(server);

const validApiKeys = ["1", "2"];

// Array to store connected clients (peers)
let connectedClients = [];

// Middleware for API key validation
socketServer.use((socket, next) => {
  const apiKey = socket.handshake.auth.apiKey;

  if (!apiKey || !validApiKeys.includes(apiKey)) {
    return next(new Error("Invalid API Key!"));
  }

  next();
});

// Event handler for new connections
socketServer.on("connection", (socket) => {
  console.log(`🐱 Connected: ${socket.id}`);

  // Add the newly connected client to the list
  connectedClients.push({
    id: socket.id,
    apiKey: socket.handshake.auth.apiKey,
  });

  // Send updated list of peers to all clients
  broadcastAvailablePeers();

  // Event handler for receiving messages
  socket.on("message", (data) => {
    console.log(`📦 from ${socket.id}:`, data);
    socketServer.emit("message", { from: socket.id, message: data });
  });

  // Event handler for client disconnect
  socket.on("disconnect", () => {
    console.log(`😿 Disconnected: ${socket.id}...`);

    // Remove disconnected client from the list
    connectedClients = connectedClients.filter((client) => client.id !== socket.id);

    // Send updated list of peers to all clients
    broadcastAvailablePeers();
  });

  // Function to broadcast list of available peers to all clients
  function broadcastAvailablePeers() {
    const peerIds = connectedClients.map((client) => client.id);
    socketServer.emit("availablePeers", peerIds);
  }
});

// Start the HTTP server
server.listen(port, host, () => {
  console.log(`⚡ Ming Socket.io Server is running on ${host}:${port}`);
});
