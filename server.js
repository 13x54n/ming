/**
 * @author: Lexy <not.so.lexy@gmail.com>
 */
const cluster = require("cluster");
const net = require("net"); // tcp
const numCPUs = require("os").cpus().length;

const port = 7070;
const host = "127.0.0.1";

/**
 * @dev Cluster Module(Improved Performance): Refer to https://nodejs.org/api/cluster.html#cluster
 */
if (cluster.isMaster) {
  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    // Fork a new worker in case of worker death
    cluster.fork();
  });
} else {
  // Code for TCP server inside each worker
  const server = net.createServer();
  server.maxConnections = 10; // Example: limit to 10 concurrent connections

  server.listen(port, host, () => {
    console.log(
      `Worker ${process.pid}: TCP Server is running on port ${port}.`
    );
  });

  let sockets = [];

  server.on("connection", function (sock) {
    if (sockets.length >= server.maxConnections) {
      // Handle exceeding max connections (e.g., reject new connections)
      console.log(
        `Worker ${process.pid}: Max connections reached. Rejecting new connection from ${sock.remoteAddress}`
      );
      sock.destroy();
      return;
    }

    console.log(
      `Worker ${process.pid}: CONNECTED: ${sock.remoteAddress}:${sock.remotePort}`
    );
    sockets.push(sock);

    sock.on("data", function (data) {
      console.log(`Worker ${process.pid}: DATA ${sock.remoteAddress}: ${data}`);
      // Write the data back to all the connected clients
      sockets.forEach(function (sock, index, array) {
        sock.write(`${sock.remoteAddress}:${sock.remotePort} said ${data}\n`);
      });
    });

    // Add a 'close' event handler to this instance of socket
    sock.on("close", function (data) {
      console.log(
        `Worker ${process.pid}: CLOSED: ${sock.remoteAddress} ${sock.remotePort}`
      );
      let index = sockets.findIndex(function (o) {
        return (
          o.remoteAddress === sock.remoteAddress &&
          o.remotePort === sock.remotePort
        );
      });
      if (index !== -1) sockets.splice(index, 1);
    });
  });
}
