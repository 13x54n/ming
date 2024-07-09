/**
 * @author: Lexy <not.so.lexy@gmail.com, 13x54n>
 */
const net = require("net");
const TCP_PORT = 18943;
const TCP_HOST = "2.tcp.ngrok.io";

const tcpClient = new net.Socket();
tcpClient.connect(TCP_PORT, TCP_HOST, () => {
  console.log("Connected to TCP server");
});

tcpClient.on("data", (data) => {
  console.log(`Received from main server: ${data}`);
});

tcpClient.on("close", () => {
  console.log("Connection to TCP Server Closed");
});

tcpClient.on("error", (err) => {
  console.error(`TCP Client Error: ${err.message}`);
});

const WebSocket = require("ws");

const WS_PORT = 8080;
const wss = new WebSocket.Server({ port: WS_PORT });

wss.on("listening", () => {
  console.log(`WS Server: ws://localhost:${WS_PORT}`);
});

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", async (data) => {
    console.log("Received message from client:", data);
    // You can handle the received message here

    try {
      const bufferData = Buffer.from(data);
      const bufferString = bufferData.toString("utf8");
      const jsonObject = JSON.parse(bufferString);

      console.log("Parsed JSON object:", jsonObject);

      // tcpClient.write(message, () => {
      //   if (!tcpClient.writable) {
      //     console.log(
      //       "Server might be dead! Restarting both client & server might help."
      //     );
      //     return res.status(500).json({
      //       error:
      //         "Server might be dead! Restarting both client & server might help.",
      //     });
      //   }

      //   console.log(`Sent to TCP server: ${message}`);
      //   res.status(200).json({ message: "Sent to TCP server" });
      // });

      // Handle the jsonObject as needed
    } catch (error) {
      console.error("Error parsing JSON:", error.message);
      // Handle parsing error or invalid data scenario
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
