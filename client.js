const net = require('net');

function connectToServer() {
  const client = new net.Socket();

  /**
   * @note Connection establishing to the server must be 
   * dynamic and not just localhost 
   * */
  client.connect(3000, 'localhost', () => {
    console.log('Connected to the relay server');

    // Send JSON-RPC request
    const request = {
      jsonrpc: '2.0',
      method: 'greet',
      params: [],
      /**
       * @dev id: 1 means i expects reponse from server else id: null
       */
      id: 1
    };
    client.write(JSON.stringify(request));
  });

  /**
   * @documentaiton on 'data' method every incoming data from server is handled
   * */
  client.on('data', (data) => {
    const response = JSON.parse(data.toString());
    console.log('Server response:', response.customPayload);
  });

  // @note Handle connection errors
  client.on('error', (err) => {
    console.error('Connection error:', err.message);
    // Retry connection after 2 seconds
    setTimeout(connectToServer, 2000);
  });

  // @note Handle server disconnection
  client.on('end', () => {
    console.log('Connection closed by server');
    // @warning Do not retry connection here
  });
}

connectToServer();
