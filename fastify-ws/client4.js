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
let leftPressed3 = false;
let rightPressed3 = false;
let leftPressed4 = false;
let rightPressed4 = false;
let paddle = {p1: "", p2: "", p3: "", p4: ""};
let start = {start: ""};
let end = {end: ""};
let mode = {nbPlayers: 4, userId: ""}; // --> catched just below
// Set mode
// const params = new URLSearchParams(window.location.search);
// // mode = {nbPlayers: parseInt(params.get("mode"), 10), userId: parseInt(params.get("userId"), 10)};
// mode = {nbPlayers: parseInt(params.get("mode"), 10), userId: ""};

// 
const output = document.getElementById('output');
output.textContent += 'Press space to start\n\n';


/**************************** ws  *****************************/
const clt_wskt = new WebSocket('ws://localhost:3000/pong');

clt_wskt.addEventListener('open', () => {	
	output.textContent += 'Connected to WebSocket\n';
	clt_wskt.send(JSON.stringify(mode));
});

clt_wskt.addEventListener('error', err => {
	output.textContent += 'Error: ' + err + '\n';
});

clt_wskt.addEventListener('close', () => {
	output.textContent += 'WebSocket closed\n';
});

clt_wskt.addEventListener('message', srv_msg => {
	try
	{
		const data = JSON.parse(srv_msg.data);		
		if ('ball' in data && 'paddle' in data  && 'x' in data.ball && 'y' in data.ball && 'p1' in data.paddle
			 && 'p2' in data.paddle && 'p3' in data.paddle && 'p4' in data.paddle)
		{
			draw(data);			
			if ('winner' in data && data.winner !== "")
			{
				output.textContent += 'Game over: ' + data.winner +' won!\n';				
				clt_wskt.send(JSON.stringify(end));
			}
		}	
		else if ('bR' in data && 'pH' in data && 'pW' in data)
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
		console.error('Invalid JSON received: ', srv_msg.data);
	}		
});

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function padMovement()
{
	if (upPressed2 === true)
		paddle.p2 = "up";
	else if (downPressed2 === true)
		paddle.p2 = "down";
	else
      	paddle.p2 = "";	
	//
	if (upPressed1 === true)
      	paddle.p1 = "up";
	else if (downPressed1 === true)
		  paddle.p1 = "down";
	else
      	paddle.p1 = "";
	//
	if (leftPressed3 === true)
      	paddle.p3 = "left";
	else if (rightPressed3 === true)
		  paddle.p3 = "right";
	else
      	paddle.p3 = "";
	//
	if (leftPressed4 === true)
      	paddle.p4 = "left";
	else if (rightPressed4 === true)
		  paddle.p4 = "right";
	else
      	paddle.p4 = "";	
	//
	if (paddle.p1 !== "" || paddle.p2 !== "" || paddle.p3 !== "" || paddle.p4 !== "")
		clt_wskt.send(JSON.stringify(paddle));
}

function keyDownHandler(e)
{
	if (e.key === "Up" || e.key === "ArrowUp")
		upPressed2 = true;
	else if (e.key === "Down" || e.key === "ArrowDown")
		downPressed2 = true;  
	else if (e.key === "w")
		upPressed1 = true;  
	else if (e.key === "s")
		downPressed1 = true;
	else if (e.key === "left" || e.key === "ArrowLeft")
		leftPressed3 = true;
	else if (e.key === "right" || e.key === "ArrowRight")
		rightPressed3 = true;  
	else if (e.key === "a")
		leftPressed4 = true;  
	else if (e.key === "d")
		rightPressed4 = true;  
	else if (e.key === " ")
		clt_wskt.send(JSON.stringify(start));
}

function keyUpHandler(e)
{
	if (e.key === "Up" || e.key === "ArrowUp") 	
		upPressed2 = false;  
	else if (e.key === "Down" || e.key === "ArrowDown")
		downPressed2 = false;  
	else if (e.key === "w")
		upPressed1 = false;	  
	else if (e.key === "s")
		downPressed1 = false;
	else if (e.key === "left" || e.key === "ArrowLeft")
		leftPressed3 = false;
	else if (e.key === "right" || e.key === "ArrowRight")
		rightPressed3 = false;  
	else if (e.key === "a")
		leftPressed4 = false;  
	else if (e.key === "d")
		rightPressed4 = false;   
}

function drawBall(x, y)
{	
	ctx.beginPath();		
	ctx.arc(x , y, ballRadius, 0, 2 * Math.PI);
	ctx.fillStyle = "rgba(255, 0, 0, 1)";
	ctx.fill();	
	ctx.closePath();
	console.log("x = " + x + " y = " + y);
}

function drawPaddles(paddle1Y, paddle2Y, paddle3X, paddle4X)
{
	ctx.beginPath();
	ctx.rect(0, paddle1Y, paddleWidth, paddleHeight);
	ctx.rect(canvas.width - paddleWidth, paddle2Y, paddleWidth, paddleHeight);
	ctx.rect(paddle3X, 0, paddleHeight, paddleWidth);
	ctx.rect(paddle4X, canvas.height - paddleWidth, paddleHeight, paddleWidth);
	ctx.fillStyle = "#0095DD";
	ctx.fill();
	ctx.closePath();
	// console.log("P1 = " + paddle1Y + " " + (paddle1Y + paddleHeight) + " P2 = " + paddle2Y + " " + (paddle2Y + paddleHeight) );
}

function printScore(s1, s2, s3, s4)
{
	// const text = " - "
	// ctx.font = "30px sans serif";
	// ctx.fillStyle = "rgba(0, 100, 0, 1)";
	// let pos = canvas.width/2 - ctx.measureText(text).width/2;	
	// ctx.fillText(text, pos, 40);
	// ctx.fillText(s1, pos - ctx.measureText(s1).width, 40);
	// ctx.fillText(s2, pos + ctx.measureText(text).width, 40);
	const score = document.getElementById('score');
	score.textContent = "P1: " + s1 + " - P2: " + s2 + " - P3: " + s3 + " - P4: " + s4; 
}

function draw(data)
{
	ctx.clearRect(0, 0, canvas.width, canvas.height);	
	printScore(data.score.p1, data.score.p2, data.score.p3, data.score.p4);	
	drawBall(data.ball.x * canvas.width, data.ball.y * canvas.height);	
	drawPaddles(data.paddle.p1 * canvas.height, data.paddle.p2 * canvas.height, data.paddle.p3 * canvas.width, data.paddle.p4 * canvas.width);
	padMovement();
}

/*
Note: Event name
"open" = When the connection is established
"message" = When a message is received
"error" = When there's an error
"close" = When the connection closes
*/