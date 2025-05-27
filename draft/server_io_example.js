/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   server.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: caguillo <caguillo@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/27 22:07:50 by caguillo          #+#    #+#             */
/*   Updated: 2025/05/28 00:10:35 by caguillo         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const Fastify = require('fastify');
const { Server } = require('socket.io');
const http = require('http');

const fastify = Fastify();

// Create a raw HTTP server from Fastify instance
const server = http.createServer(fastify.server);
const io = new Server(server);

// Game state
let players = {};
let spectators = [];
let ball = { x: 200, y: 150, vx: 4, vy: 3 };
let paddles = { left: { y: 150 }, right: { y: 150 } };
let score = { left: 0, right: 0 };

function resetBall() {
  ball.x = 200;
  ball.y = 150;
  ball.vx *= -1;
  ball.vy = (Math.random() * 6) - 3;
}

// Game loop
setInterval(() => {
  ball.x += ball.vx;
  ball.y += ball.vy;
  if (ball.y <= 0 || ball.y >= 300) ball.vy *= -1;

  if (ball.x <= 0) {
    score.right++;
    resetBall();
  } else if (ball.x >= 400) {
    score.left++;
    resetBall();
  }

  io.emit('gameState', {
    ball: { x: ball.x, y: ball.y },
    paddles,
    score
  });
}, 50);

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('Connected:', socket.id);

  if (!players.left) {
    players.left = socket.id;
    socket.emit('role', 'left');
  } else if (!players.right) {
    players.right = socket.id;
    socket.emit('role', 'right');
  } else {
    spectators.push(socket.id);
    socket.emit('role', 'spectator');
  }

  socket.on('paddleMove', (y) => {
    if (players.left === socket.id) paddles.left.y = y;
    else if (players.right === socket.id) paddles.right.y = y;
  });

  socket.on('disconnect', () => {
    if (players.left === socket.id) players.left = null;
    else if (players.right === socket.id) players.right = null;
    else spectators = spectators.filter(id => id !== socket.id);
    console.log('Disconnected:', socket.id);
  });
});

// Start Fastify HTTP server
fastify.get('/', async (req, reply) => {
  return { pong: 'OK' };
});

server.listen(3000, () => {
  console.log('Fastify + Socket.IO server running on http://localhost:3000');
});
