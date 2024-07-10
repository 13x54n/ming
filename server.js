/**
 * @author: Lexy <not.so.lexy@gmail.com, 13x54n>
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
  /**
   * Determining the ideal maximum number of connections (server.maxConnections) for a TCP server
   * depends on various factors including hardware resources, expected workload, and the nature of
   * the application.
   * Here are some considerations to help determine an appropriate server.maxConnections value:
   *
   * server.maxConnections=numCPUs×connections per core=4×50=200
   */
  server.maxConnections = 100;

  server.listen(port, host, () => {
    console.log(
      `Worker ${process.pid}: TCP Server is running on port ${port}.`
    );
  });

  let sockets = [];

  server.on("connection", function (sock) {
    if (sockets.length >= server.maxConnections) {
      /**
       * Handle exceeding max connections -> reject new connections, but better algorithm can be implemented
       */
      console.log(
        `Worker ${process.pid}: Max connections reached. Rejecting new connection from ${sock.remoteAddress}`
      );

      sock.destroy();
      return;
    }

    console.log(
      `Worker ${process.pid}: CONNECTED: ${sock.remoteAddress}:${sock.remotePort}` // this should be user public address
    );

    sock.on("data", function (data) {
      // @dev socket connection must only be listed if node is authorized
      sockets.push(sock);
      // console.log(`Worker ${process.pid}: DATA ${sock.remoteAddress}: ${data}`);

      sock.write(
        `${sock.remoteAddress}:${sock.remotePort} said ${data}, and Helllo, from Lexy!\n`
      );

      // Write the data back to all the connected clients
      sockets.forEach(function (sock) {
        sock.write(`Helllo, from Lexy!\n`);
      });

      // @dev receive socket information
      // switch(data){
      //   case '':
      //     return;
      //   default:
      //     return;
      // }
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
