const net = require('net');

function connectToServer() {
  const client = new net.Socket();

  // Connect to the server
  client.connect(3000, 'localhost', () => {
    console.log('Connected to server');

    // Send JSON-RPC request
    const request = {
      jsonrpc: '2.0',
      method: 'greet',
      params: ['John'],
      id: 1
    };
    client.write(JSON.stringify(request));
  });

  // Handle incoming data
  client.on('data', (data) => {
    const response = JSON.parse(data.toString());
    console.log('Server response:', response.result);
  });

  // Handle connection errors
  client.on('error', (err) => {
    console.error('Connection error:', err.message);
    // Retry connection after 2 seconds
    setTimeout(connectToServer, 2000);
  });

  // Handle server disconnection
  client.on('end', () => {
    console.log('Connection closed by server');
    // Retry connection after 2 seconds
    setTimeout(connectToServer, 2000);
  });
}

// Initial connection attempt
connectToServer();
