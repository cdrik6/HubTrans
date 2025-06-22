const output = document.getElementById('output');
const clt_wskt = new WebSocket('ws://localhost:3000/pong');

clt_wskt.addEventListener('close', () => {
	output.textContent += 'WebSocket closed\n';
});

clt_wskt.addEventListener('error', err => {
  output.textContent += 'Error: ' + err + '\n';
});

clt_wskt.addEventListener('open', () => {
	output.textContent += 'Connected to WebSocket\n';
	clt_wskt.send(JSON.stringify(paddles));
});

clt_wskt.addEventListener('message', event => {
	try {
		const data = JSON.parse(event.data);
		// console.log('Ball position:', data.ball.x, data.ball.y);
		// console.log('Pad position:', data.paddle.p1, data.paddle.p2);
		// drawBall(data.ball.x, data.ball.y)
		// console.log('Score P2:', data.score.p2);
		draw(data.ball.x, data.ball.y, data.paddle.p1, data.paddle.p2);
		// clt_wskt.send(JSON.stringify(paddles));
	}
	catch (e) {
		console.error('Invalid JSON received:', event.data);
	}		
});


let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
const ballRadius = 10;
const paddleHeight = 80;
const paddleWidth = 3 * ballRadius / 2;
// let paddles = {pad: {p1:paddle1Y, p2:paddle2Y} }
let paddle = {p1:"", p2:""};

// document.addEventListener("keydown", keyDownHandler, false);
// document.addEventListener("keyup", keyUpHandler, false);

document.addEventListener("keydown", (event) => {
	downHandler(event);
	clt_wskt.send(JSON.stringify(paddle));	
}, false);

document.addEventListener("keyup", (event) => {
	upHandler(event);
	//clt_wskt.send(JSON.stringify(paddle));	
}, false);


function downHandler(e) {
  if (e.key == "Up" || e.key == "ArrowUp") {
    paddle.p2 = "up";
  }
  else if (e.key == "Down" || e.key == "ArrowDown") {
    paddle.p2 = "down";
  }
  else if (e.key == "w") {
    paddle.p1 = "up";
  }
  else if (e.key == "x") {
    paddle.p1 = "down";
  }  
}

function upHandler(e) {
  if (e.key == "Up" || e.key == "ArrowUp") {
    paddle.p2 = "";
  }
  else if (e.key == "Down" || e.key == "ArrowDown") {
    paddle.p2 = "";
  }
  else if (e.key == "w") {
    paddle.p1 = "";
  }
  else if (e.key == "x") {
    paddle.p1 = "";
  }
}

function drawBall(x, y) {	
	ctx.beginPath();		
	ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
	ctx.fillStyle = "rgba(255, 0, 0, 1)";
	ctx.fill();	
	ctx.closePath();		
}

function drawPaddles(paddle1Y, paddle2Y) {
  ctx.beginPath();
  ctx.rect(0, paddle1Y, paddleWidth, paddleHeight);
  ctx.rect(canvas.width - paddleWidth, paddle2Y, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function draw(x,y, p1Y, p2Y) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);	  		
	drawBall(x,y);
	drawPaddles(p1Y, p2Y);
	// padMovement();	
	//requestAnimationFrame(draw);
}

// setInterval(draw, 50);
// draw();





/* Note: Event name
"open" = When the connection is established
"message" = When a message is received
"error" = When there's an error
"close" = When the connection closes
*/


// function padMovement()
// {
// 	if (upPressed2 == true)
// 	{
// 		if (paddle2Y > 0 )
// 			paddle2Y = paddle2Y - padSpeed;
// 		clt_wskt.send(JSON.stringify(paddles));
// 	}
// 	if (downPressed2 == true)
// 	{
// 		if (paddle2Y + paddleHeight < canvas.height )
// 			paddle2Y = paddle2Y + padSpeed;
// 		clt_wskt.send(JSON.stringify(paddles));
// 	}
// 	if (upPressed1 == true)
// 	{
// 		if (paddle1Y > 0 )
// 			paddle1Y = paddle1Y - padSpeed;
// 		clt_wskt.send(JSON.stringify(paddles));
// 	}
// 	if (downPressed1 == true)
// 	{
// 		if (paddle1Y + paddleHeight < canvas.height )
// 			paddle1Y = paddle1Y + padSpeed;
// 		clt_wskt.send(JSON.stringify(paddles));
// 	}
// 	paddles = {pad: {p1:paddle1Y, p2:paddle2Y} }
// 	// clt_wskt.addEventListener('open', () => {
// 	// 	// output.textContent += 'Connected to WebSocket\n';
// 	// 	// clt_wskt.send('Hello from client');
		
// 	// });
// }

// function keyDownHandler(e) {
//   if (e.key == "Up" || e.key == "ArrowUp") {
//     upPressed2 = true;
//   }
//   else if (e.key == "Down" || e.key == "ArrowDown") {
//     downPressed2 = true;	
//   }
//   else if (e.key == "w") {
//     upPressed1 = true;	
//   }
//   else if (e.key == "x") {
//     downPressed1 = true;	
//   }
// }

// function keyUpHandler(e) {
//   if (e.key == "Up" || e.key == "ArrowUp") {
//     upPressed2 = false;
//   }
//   else if (e.key == "Down" || e.key == "ArrowDown") {
//     downPressed2 = false;
//   }
//   else if (e.key == "w") {
//     upPressed1 = false;	
//   }
//   else if (e.key == "x") {
//     downPressed1 = false;	
//   }
// }