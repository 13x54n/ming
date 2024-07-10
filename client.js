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
  console.log(`${data}`);
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
    /** 
     * data format 
     * {
     *    method_name: string,
     *    payload:,
     *    from: Lexy 
     * }
     */
    try {
      tcpClient.write(data, () => {
        if (!tcpClient.writable) {
          console.log(
            "Server might be dead! Restarting both client & server might help."
          );
          return res.status(500).json({
            error:
              "Server might be dead! Restarting both client & server might help.",
          });
        }

        console.log(`Sent to TCP server: ${data}`);
      });

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
