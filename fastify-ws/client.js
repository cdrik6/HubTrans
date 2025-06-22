/************* variables for pong **************************/
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let ballRadius = 10; // default
let paddleHeight = 80; // default
let paddleWidth = 15; // 3 * ballRadius / 2; // default
let upPressed1 = false;
let downPressed1 = false;
let upPressed2 = false;
let downPressed2 = false;
let paddle = {p1:"", p2:""};
//  let canvasSize = {w:canvas.width, h:canvas.height};

/**************************** ws  *****************************/
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
	// clt_wskt.send(JSON.stringify(paddle));
	clt_wskt.send(JSON.stringify(canvasSize));
});

clt_wskt.addEventListener('message', event => {
	try
	{
		const data = JSON.parse(event.data);
		console.log(data);		
		// console.log('Ball position:', data.ball.x, data.ball.y);
		// console.log('Pad position:', data.paddle.p1, data.paddle.p2);		
		// console.log('Score P2:', data.score.p2);		
		if ('ball' in data && 'paddle' in data  && 'x' in data.ball && 'y' in data.ball && 'p1' in data.paddle && 'p2' in data.paddle)
			draw(data.ball.x, data.ball.y, data.paddle.p1, data.paddle.p2);		
		if ('bR' in data && 'pH' in data && 'pW' in data)
		{				
			ballRadius = data.bR * canvas.height;
			paddleHeight = data.pH * canvas.height;
			paddleWidth = data.pW * canvas.height;
			output.textContent += ballRadius + '\n';
			output.textContent += paddleHeight + '\n';
			output.textContent += paddleWidth + '\n';
		}	
	}
	catch (e) {
		console.error('Invalid JSON received:', event.data);
	}		
});

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

// document.addEventListener("keydown", (event) => {
// 	downHandler(event);
// 	clt_wskt.send(JSON.stringify(paddle));	
// }, false);

// document.addEventListener("keyup", (event) => {
// 	upHandler(event);
// 	//clt_wskt.send(JSON.stringify(paddle));	
// }, false);


// function downHandler(e) {
//   if (e.key == "Up" || e.key == "ArrowUp") {
//     paddle.p2 = "up";
//   }
//   else if (e.key == "Down" || e.key == "ArrowDown") {
//     paddle.p2 = "down";
//   }
//   else if (e.key == "w") {
//     paddle.p1 = "up";
//   }
//   else if (e.key == "x") {
//     paddle.p1 = "down";
//   }  
// }

// function upHandler(e) {
//   if (e.key == "Up" || e.key == "ArrowUp") {
//     paddle.p2 = "";
//   }
//   else if (e.key == "Down" || e.key == "ArrowDown") {
//     paddle.p2 = "";
//   }
//   else if (e.key == "w") {
//     paddle.p1 = "";
//   }
//   else if (e.key == "x") {
//     paddle.p1 = "";
//   }
// }

function padMovement()
{
	if (upPressed2 === true && upPressed1 === true)
  	{  	  
      	paddle.p2 = "up";
		paddle.p1 = "up";
	  	clt_wskt.send(JSON.stringify(paddle));
	}
	else if (upPressed2 === true && upPressed1 === false)
  	{  	  
      	paddle.p2 = "up";
		paddle.p1 = "";
	  	clt_wskt.send(JSON.stringify(paddle));
	}
	else if (upPressed2 === false && upPressed1 === true)
  	{  	  
      	paddle.p2 = "";
		paddle.p1 = "up";
	  	clt_wskt.send(JSON.stringify(paddle));
	}
	else if (downPressed2 === true  && downPressed1 === true)
  	{  	  
      	paddle.p2 = "down";
		paddle.p1 = "down";
	  	clt_wskt.send(JSON.stringify(paddle));
	}
	else if (downPressed2 === true && downPressed1 === false)
  	{  	  
      	paddle.p2 = "down";
		paddle.p1 = "";
	  	clt_wskt.send(JSON.stringify(paddle));
	}	
	else if (downPressed2 === false && downPressed1 === true)
  	{  	  
      	paddle.p2 = "";
		paddle.p1 = "down";
	  	clt_wskt.send(JSON.stringify(paddle));
	}	
	else if (upPressed2 === true && downPressed1 === true)
  	{  	  
      	paddle.p2 = "up";
		paddle.p1 = "down";
	  	clt_wskt.send(JSON.stringify(paddle));
	}
	else if (downPressed2 === true && upPressed1 === true)
  	{  	  
      	paddle.p2 = "down";
		paddle.p1 = "up";
	  	clt_wskt.send(JSON.stringify(paddle));
	}
}

// function padMovement()
// {
// 	if (upPressed2 === true)
//   	{  	  
//       	paddle.p2 = "up";
// 	  	clt_wskt.send(JSON.stringify(paddle));
// 	}
// 	if (downPressed2 === true)
//   	{  	  	
//     	paddle.p2 = "down";
// 		clt_wskt.send(JSON.stringify(paddle));
// 	}
// 	if (upPressed1 === true)
//   	{ 		
//     	paddle.p1 = "up";
// 		clt_wskt.send(JSON.stringify(paddle));
// 	}
// 	if (downPressed1 === true)
//   	{		
//       	paddle.p1 = "down";
// 		clt_wskt.send(JSON.stringify(paddle));
// 	}	
// }

function keyDownHandler(e)
{
  if (e.key === "Up" || e.key === "ArrowUp") {
    upPressed2 = true;    
  }
  else if (e.key === "Down" || e.key === "ArrowDown") {
    downPressed2 = true;	
  }
  else if (e.key === "w") {
    upPressed1 = true;	
  }
  else if (e.key === "x") {
    downPressed1 = true;	
  }
}

function keyUpHandler(e)
{
  if (e.key === "Up" || e.key === "ArrowUp") {
    upPressed2 = false;
  }
  else if (e.key === "Down" || e.key === "ArrowDown") {
    downPressed2 = false;
  }
  else if (e.key === "w") {
    upPressed1 = false;	
  }
  else if (e.key === "x") {
    downPressed1 = false;	
  }
}

/* Note: Event name
"open" = When the connection is established
"message" = When a message is received
"error" = When there's an error
"close" = When the connection closes
*/

function drawBall(x, y) {	
	ctx.beginPath();		
	ctx.arc(x , y, ballRadius, 0, Math.PI * 2);
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
	drawBall(x * canvas.width,y * canvas.height);
	drawPaddles(p1Y * canvas.height, p2Y * canvas.height);
	padMovement();	
	//requestAnimationFrame(draw);
}
// setInterval(draw, 50);
// draw();
