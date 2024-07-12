/**
 * @author: Lexy <not.so.lexy@gmail.com, 13x54n>
 */
const http = require('http');
const io = require('socket.io');

const port = 7070;
const host = "127.0.0.1";

const server = http.createServer();
const socketServer = io(server);

socketServer.on('connection', (socket) => {
  console.log(`🐱 Connected: ${socket.id}`);

  // Event handler for receiving messages
  socket.on('message', (data) => {
    console.log(`\n📦 from ${socket.id}:`, data);
    
    socketServer.emit('message', data);
  });

  socket.on('disconnect', () => {
    console.log(`😿 Disconnected: ${socket.id}...`);
  });
});

server.listen(port, host, () => {
  console.log(`⚡ Ming Socket.io Server is running on ${host}:${port}`);
});
