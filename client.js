/**
 * @author: Lexy
 */
const net = require("net");
const express = require("express");

const app = express();
const TCP_PORT = 12620;
const TCP_HOST = "0.tcp.ngrok.io";

const tcpClient = new net.Socket();
tcpClient.connect(TCP_PORT, TCP_HOST, () => {
  console.log("Connected to TCP server");
});

tcpClient.on("data", (data) => {
  // console.log(`Received from main server: ${data}`);
  // data should be in stringified json format

  // convert stringfied json into json 

  // switch case should be handled here
});

tcpClient.on("close", () => {
  console.log("Connection to TCP Server Closed");
});

tcpClient.on("error", (err) => {
  console.error(`TCP Client Error: ${err.message}`);
});

// Example endpoint to send data to TCP server
app.post("/sendToTcpServer", (req, res) => {
  const message = req.body.message;

  // Send message to TCP server
  tcpClient.write(message, () => {
    console.log(`Sent to TCP server: ${message}`);
    res.status(200).json({ message: "Sent to TCP server" });
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
