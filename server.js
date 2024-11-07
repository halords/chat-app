// server.js
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static('public'));

const users = {};
const clicksLog = [];

wss.on('connection', (ws) => {
  const userID = uuidv4();
  const username = `User-${userID.slice(0, 5)}`;
  users[userID] = username;

  ws.send(JSON.stringify({ type: 'welcome', userID, username }));

  ws.on('message', (message) => {
    const data = JSON.parse(message);

    if (data.type === 'chat') {
      broadcast({ type: 'chat', user: username, message: data.message });
    } else if (data.type === 'link') {
      clicksLog.push({ user: username, link: data.link });
      broadcast({ type: 'log', message: `${username} clicked ${data.link}` });
    }
  });

  ws.on('close', () => {
    delete users[userID];
  });
});

function broadcast(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
