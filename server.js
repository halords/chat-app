const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files (index.html, js, css)
app.use(express.static(path.join(__dirname, 'public')));

// Set up Socket.IO communication
io.on('connection', (socket) => {
  console.log('a user connected');

  // Listen for messages from clients
  socket.on('message', (data) => {
    io.emit('message', data);  // Broadcast message to all connected clients
  });

  // Listen for links from clients
  socket.on('link', (data) => {
    io.emit('link', data);  // Broadcast link to all connected clients
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// Define the port dynamically (Render uses process.env.PORT)
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
