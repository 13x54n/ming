const net = require("net");

let nextClientId = 1;
const clients = new Map();

/**
 * @header TCP server
 */
const server = net.createServer({ allowHalfOpen: true }, (socket) => {
  /**
   * @dev add authentication or validation method in order to add clients to provide the hosting
   */
  const clientId = nextClientId++;
  clients.set(clientId, socket);
  console.log(`💻 Client ${clientId} connected.`);

  /**
   * @version: lts
   * @documentation all the incoming messages are handled in this chain
   */
  socket.on("data", (data) => {
    const request = JSON.parse(data.toString());

    /**
     * @note static routing used can be upgraded
     * @description checks the req method is greet and sends the response with clients id
     * but it should be more cryptographic later for better security and privacy.
     */
    if (request.method === "greet") {
      const response = {
        jsonrpc: "2.0",
        id: request.id,
        /**
         * @note both key {result, customPayload} are just vairables||params
         **/
        result: `Hello, Client ${clientId}!`,
        customPayload: `👋 Hello, Client ${clientId}!`,
      };
      socket.write(JSON.stringify(response));
    }
  });

  /**
   * @note current version do not sync with closing nodes for now
   * instead log which client was disconnected
   */
  socket.on("end", () => {
    clients.delete(clientId);
    console.log(`❌ Client ${clientId} disconnected`);
  });
});

/**
 * @note Start the TCP server on port 3000 by default or you can pass it to environment
 */
server.listen(process.env.PORT || 3000, () => {
  console.log("🔋 JSON-RPC based TCP Server running on port 3000!");
});
