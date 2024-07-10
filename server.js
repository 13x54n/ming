/**
 * @author: Lexy <not.so.lexy@gmail.com, 13x54n>
 */
const net = require("net"); // tcp
const numCPUs = require("os").cpus().length;

const port = 7070;
const host = "127.0.0.1";

// Code for TCP server
const server = net.createServer();

// @dev need to benchmark whats the ideal connections
server.maxConnections = 100;

// Start listening on defined port and host
server.listen(port, host, () => {
  console.log(`Worker ${process.pid}: TCP Server is running on port ${port}.`);
});

let sockets = [];

// Event handler for new connections
server.on("connection", function (sock) {
  if (sockets.length >= server.maxConnections) {
    // Handle exceeding max connections -> reject new connections
    console.log(
      `Worker ${process.pid}: Max connections reached. Rejecting new connection from ${sock.remoteAddress}`
    );
    sock.destroy();
    return;
  }

  // Log new connection
  console.log(
    `Worker ${process.pid}: CONNECTED: ${sock.remoteAddress}:${sock.remotePort}`
  );

  // Add the socket to the sockets array
  sockets.push(sock);

  // Event handler for incoming data
  sock.on("data", function (data) {
    try {
      // Parse incoming data assuming it's JSON
      const bufferData = Buffer.from(data);
      const bufferString = bufferData.toString("utf8");
      const jsonData = JSON.parse(bufferString);

      console.log(
        `Worker ${process.pid}: Received data from ${sock.remoteAddress}:${sock.remotePort}:`,
        jsonData
      );

      // Handle different message types
      if (jsonData.method_name === "broadcast") {
        // Broadcast message to all connected clients
        broadcastToAll("Some Calculated Output!");
      } else if (jsonData.method_name === "private_message") {
        // Example of sending a private message to a specific client
        sendPrivateMessage(sock, "This is a private message!");
      }
    } catch (error) {
      console.error(
        `Worker ${process.pid}: Error parsing JSON or handling message: ${error.message}`
      );
    }
  });

  // Event handler for connection close
  sock.on("close", function () {
    console.log(
      `Worker ${process.pid}: CLOSED: ${sock.remoteAddress} ${sock.remotePort}`
    );
    // Remove the closed socket from the sockets array
    sockets = sockets.filter((socket) => socket !== sock);
  });
});

// Function to broadcast message to all connected sockets
function broadcastToAll(message) {
  sockets.forEach(function (socket) {
    if (!socket.destroyed) {
      socket.write(JSON.stringify(message));
    }
  });
}

// Function to get all connected peers
function getAllPeers() {
  const peers = sockets.map((socket) => ({
    remoteAddress: socket.remoteAddress,
    remotePort: socket.remotePort,
    // connectedAt: socket.connectTime, // Assuming connectTime is a custom property or you have a way to track connection time
  }));

  return peers;
}

// Function to send a private message to a specific client
function sendPrivateMessage(target, message) {
  if (!target.destroyed) {
    const peers = getAllPeers();
    target.write(`${JSON.stringify(peers)}\n`);
  } else {
    console.log(
      `Worker ${process.pid}: Unable to send private message: Client ${target.remoteAddress}:${target.remotePort} is disconnected.`
    );
  }
}
