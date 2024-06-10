const net = require("net");

// Create a TCP server
const server = net.createServer((socket) => {
  console.log("Client connected");

  // Handle incoming data
  socket.on("data", (data) => {
    const request = JSON.parse(data.toString());
    if (request.method === "greet") {
      const response = {
        jsonrpc: "2.0",
        id: request.id,
        result: `Hello, ${request.params[0]}!`,
      };
      socket.write(JSON.stringify(response));
    }
  });

  // Handle client disconnection
  socket.on("end", () => {
    console.log("Client disconnected");
  });
});

// Start the TCP server on port 3000
server.listen(3000, () => {
  console.log("JSON-RPC server is running on port 3000");
});
