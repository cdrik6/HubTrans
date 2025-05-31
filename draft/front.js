const socket = new WebSocket('ws://localhost:3000/ws');

socket.onmessage = (event) => {
  const state = JSON.parse(event.data);
  console.log('Game State:', state);
};

socket.onopen = () => {
  console.log('Connected to game server');

  // Example: move left paddle
  socket.send(JSON.stringify({
    type: 'paddleMove',
    side: 'left',
    y: 160
  }));
};
