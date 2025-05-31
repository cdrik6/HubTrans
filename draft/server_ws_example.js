/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   server_ws_example.js                               :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: caguillo <caguillo@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/30 21:29:27 by caguillo          #+#    #+#             */
/*   Updated: 2025/05/30 21:34:14 by caguillo         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const Fastify = require('fastify');
const websocket = require('@fastify/websocket');

const fastify = Fastify();
fastify.register(websocket);

// Store players and spectators
let clients = [];

let ball = { x: 200, y: 150, vx: 4, vy: 3 };
let paddles = {
  left: { y: 150 },
  right: { y: 150 }
};
let score = { left: 0, right: 0 };

// Game loop: update every 50ms (~20 FPS for demo)
setInterval(() => {
  // Move ball
  ball.x += ball.vx;
  ball.y += ball.vy;

  // Bounce top/bottom
  if (ball.y <= 0 || ball.y >= 300) {
    ball.vy *= -1;
  }

  // Check goal
  if (ball.x <= 0) {
    score.right++;
    resetBall();
  } else if (ball.x >= 400) {
    score.left++;
    resetBall();
  }

  // Send update to all clients
  const gameState = JSON.stringify({ ball, paddles, score });
  clients.forEach(client => {
    if (client.socket.readyState === 1) {
      client.socket.send(gameState);
    }
  });
}, 50);

function resetBall() {
  ball.x = 200;
  ball.y = 150;
  ball.vx *= -1;
  ball.vy = (Math.random() * 6) - 3;
}

// WebSocket route
fastify.get('/ws', { websocket: true }, (connection, req) => {
  console.log('New client connected');
  const client = { socket: connection.socket };
  clients.push(client);

  connection.socket.on('message', (msg) => {
    try {
      const data = JSON.parse(msg);
      if (data.type === 'paddleMove') {
        const side = data.side; // "left" or "right"
        if (paddles[side]) {
          paddles[side].y = data.y;
        }
      }
    } catch (e) {
      console.error('Invalid message:', e);
    }
  });

  connection.socket.on('close', () => {
    clients = clients.filter(c => c.socket !== connection.socket);
    console.log('Client disconnected');
  });
});

// Start server
fastify.listen({ port: 3000 }, () => {
  console.log('Pong backend running on http://localhost:3000');
});
