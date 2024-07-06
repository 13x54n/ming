/**
 * @author: Lexy
 */
const net = require("net");
const client = new net.Socket();
const port = 7070;
const host = "127.0.0.1";

client.connect(port, host, function () {
  console.log("Connected to server");
  client.write("Hello From Client " + client.address().address);
});

client.on("data", function (data) {
  console.log("Received from server: " + data);
});

client.on("close", function () {
  console.log("Connection to Server Closed, Server might be down!");
});

client.on("error", function (err) {
  console.error("Error: " + err.message);
});
