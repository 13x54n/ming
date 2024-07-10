const net = require("net");
const WebSocket = require("ws");

const TCP_PORT = 18943;
const TCP_HOST = "2.tcp.ngrok.io";
const WS_PORT = 8080;

// TCP Client Setup
const tcpClient = new net.Socket();
tcpClient.connect(TCP_PORT, TCP_HOST, () => {
  console.log("Connected to TCP server");
});

tcpClient.on("data", (data) => {
  console.log(`Received from TCP server: ${data}`);
  // Handle received data from TCP server as needed
});

tcpClient.on("close", () => {
  console.log("Connection to TCP Server Closed");
});

tcpClient.on("error", (err) => {
  console.error(`TCP Client Error: ${err.message}`);
});

// WebSocket Server Setup
const wss = new WebSocket.Server({ port: WS_PORT });

wss.on("listening", () => {
  console.log(`WS Server: ws://localhost:${WS_PORT}`);
});

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", async (data) => {
    try {
      // Forward message to TCP server
      tcpClient.write(data, () => {
        if (!tcpClient.writable) {
          console.log(
            "TCP server might be dead! Restarting both client & server might help."
          );
          // Handle TCP server error
        }
        console.log(`Sent to TCP server: ${data}`);
      });

      // Broadcast message to all WebSocket clients
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(data);
        }
      });

      // Handle the jsonObject as needed
    } catch (error) {
      console.error("Error handling message:", error.message);
      // Handle error scenario
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });

  // Example: Sending initial message to client
  ws.send("Hello, client! This is the WebSocket server.");
});

wss.on("error", (error) => {
  console.error("WebSocket server error:", error);
});
