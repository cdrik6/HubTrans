const output = document.getElementById('output');

// document.getElementById('canvas').onclick = () => {
	const clt_wskt = new WebSocket('ws://localhost:3000/pong');

	// clt_wskt.addEventListener('open', () => {
	// 	output.textContent += 'Connected to WebSocket\n';
	// 	clt_wskt.send('Hello from client');
	// });

	// clt_wskt.addEventListener('message', event => {
	// 	output.textContent += 'Received ici: ' + event.data + '\n';
	// });

	clt_wskt.addEventListener('close', () => {
		output.textContent += 'WebSocket closed\n';
	});

	clt_wskt.addEventListener('error', err => {
	output.textContent += 'Error: ' + err + '\n';
	});

	clt_wskt.addEventListener('message', event => {
		try {
			const data = JSON.parse(event.data);
    		console.log('Ball position:', data.ball.xB, data.ball.yB);
			drawBall(data.ball.xB, data.ball.yB)
    		//console.log('Score P2:', data.score.p2);
			draw();
			clt_wskt.send(JSON.stringify(paddles));
		}
		catch (e) {
			console.error('Invalid JSON received:', event.data);
		}		
	});

	clt_wskt.addEventListener('open', () => {
		output.textContent += 'Connected to WebSocket\n';
		// clt_wskt.send('Hello from client');
		clt_wskt.send(JSON.stringify(paddles));
	});
// };

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
const ballRadius = 10; const paddleHeight = 80; const paddleWidth = 3 * ballRadius / 2;
let paddle1Y = (canvas.height - paddleHeight) / 2; let paddle2Y = (canvas.height - paddleHeight) / 2;
let upPressed1 = false; let downPressed1 = false; let upPressed2 = false; let downPressed2 = false;
let paddles = {pad: {p1:paddle1Y, p2:paddle2Y} }
const padSpeed = 3;
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function drawBall(x, y) {	
	ctx.beginPath();		
	ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
	ctx.fillStyle = "rgba(255, 0, 0, 1)";
	ctx.fill();	
	ctx.closePath();		
}

function drawPaddles() {
  ctx.beginPath();
  ctx.rect(0, paddle1Y, paddleWidth, paddleHeight);
  ctx.rect(canvas.width - paddleWidth, paddle2Y, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);	  		
	//drawBall();
	drawPaddles();
	padMovement();	
	//requestAnimationFrame(draw);
}
// setInterval(draw, 50);
draw();

function padMovement()
{
	if (upPressed2 == true)
	{
		if (paddle2Y > 0 )
			paddle2Y = paddle2Y - padSpeed;
		clt_wskt.send(JSON.stringify(paddles));
	}
	if (downPressed2 == true)
	{
		if (paddle2Y + paddleHeight < canvas.height )
			paddle2Y = paddle2Y + padSpeed;
		clt_wskt.send(JSON.stringify(paddles));
	}
	if (upPressed1 == true)
	{
		if (paddle1Y > 0 )
			paddle1Y = paddle1Y - padSpeed;
		clt_wskt.send(JSON.stringify(paddles));
	}
	if (downPressed1 == true)
	{
		if (paddle1Y + paddleHeight < canvas.height )
			paddle1Y = paddle1Y + padSpeed;
		clt_wskt.send(JSON.stringify(paddles));
	}
	paddles = {pad: {p1:paddle1Y, p2:paddle2Y} }
	// clt_wskt.addEventListener('open', () => {
	// 	// output.textContent += 'Connected to WebSocket\n';
	// 	// clt_wskt.send('Hello from client');
		
	// });
}

function keyDownHandler(e) {
  if (e.key == "Up" || e.key == "ArrowUp") {
    upPressed2 = true;
  }
  else if (e.key == "Down" || e.key == "ArrowDown") {
    downPressed2 = true;	
  }
  else if (e.key == "w") {
    upPressed1 = true;	
  }
  else if (e.key == "x") {
    downPressed1 = true;	
  }
}

function keyUpHandler(e) {
  if (e.key == "Up" || e.key == "ArrowUp") {
    upPressed2 = false;
  }
  else if (e.key == "Down" || e.key == "ArrowDown") {
    downPressed2 = false;
  }
  else if (e.key == "w") {
    upPressed1 = false;	
  }
  else if (e.key == "x") {
    downPressed1 = false;	
  }
}

	




// Event name
// "open" = When the connection is established
// "message" = When a message is received
// "error" = When there's an error
// "close" = When the connection closes