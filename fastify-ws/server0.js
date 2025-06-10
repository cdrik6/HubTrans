const fastify = require('fastify')();
// const ws = require('ws');
// const WebSocketServer = ws.WebSocketServer;
const { WebSocketServer } = require('ws'); // just the WebSocketServer part of the ws module
const http = require('http');

// http route
fastify.get('/hello', async (request, reply) => {
        const toto = request.query.toto || 'titi';
        reply.send({ message: `Hello ${toto}!` }); 
    }
);

// http server from Fastify who will manage http requests so far
// const server = http.createServer(fastify); // --> not good, only for express
fastify.ready().then(() => {
  
    const server = http.createServer((req, res) => {
        fastify.routing(req, res);
    });
    
    // bind websocketserver to the http server
    const srv_wskt = new WebSocketServer({ server , path: '/pong' });
    
    srv_wskt.on('connection', (clt_skt, res) => {        
        console.log('Server: Client connected');
        //
        clt_skt.on('message', clt_msg => {           
            console.log('Server received:', clt_msg.toString());
            // paddles from client
			//  let data;
            try {
                const data = JSON.parse(clt_msg);
                console.log('pad1:', data.p1);
                console.log('pad2:', data.p2);
				paddle1Y = data.p1;
				paddle2Y = data.p2;
				// paddlesY(data.p1, data.p2);
            }
            catch (e) {
                console.error('Invalid JSON from client');
            }
        });
        //
        clt_skt.on('close', () => {
            console.log('Server: Client disconnected');
        });
        //        
		setInterval( () => { clt_skt.send(JSON.stringify(play())) }, fps);
    });

    server.listen(3000, () => {
        console.log("Server listening");
    });
});  

// fastify.listen({port:3000}, (err, address) => {
//     if(err) {
//         console.error(err);
//         process.exit(1);
//     }
//     console.log(`Server listening at: ${address}`);    
// });

/************************************************************************************** */
const canvasHeight = 320; const canvasWidth = 480; //--> to be catched ******************************//
const ballRadius = 10; const paddleHeight = 80; const paddleWidth = 3 * ballRadius / 2;
// let upPressed1 = false; let downPressed1 = false; let upPressed2 = false; let downPressed2 = false;
let x = canvasWidth / 2;
let y = canvasHeight / 2;
const ballSpeed = 6;
let dx = ballSpeed;
let dy = ballSpeed;
let signX = getRandomSign();
let signY = getRandomSign();
let loose1 = false;
let loose2 = false;
let padTouch1 = false;
let padTouch2 = false;
const fps = 40;
let paddle1Y = (canvasHeight - paddleHeight) / 2; 
let paddle2Y = (canvasHeight - paddleHeight) / 2;
let gameState = {
	ball: {x:x, y:y}
	// paddle: {p1:paddle1Y, p2:paddle2Y}
	//score: {p1:1, p2:2}
}
// const padSpeed = 6;

// function paddlesY(pad1, pad2)
// {
// 	if (pad2 === "up" && paddle2Y > 0)		
// 		paddle2Y -= padSpeed;
// 	if (pad2 === "down" && paddle2Y + paddleHeight < canvasHeight)		
// 		paddle2Y += padSpeed;
// 	if (pad1 === "up" && paddle1Y > 0 )	
// 		paddle1Y -= padSpeed;
// 	if (pad1 === "down" && paddle1Y + paddleHeight < canvasHeight)	
// 		paddle1Y += padSpeed;	
// 	gameState.paddle.p2 = paddle2Y;
// 	gameState.paddle.p1 = paddle1Y;
// }
// gameState.pad = {p1:paddle1Y, p2:paddle2Y};	


function play() {
    // check
	if (x + ballRadius >= canvasWidth)
		loose2 = true;
	else if (x - ballRadius <= 0)
		loose1 = true;
	else if (y + ballRadius >= canvasHeight || y - ballRadius <= 0)	
		signY = -signY;		
	else if (distBallPad2(x, y) <= 0) 
	{
		if (padTouch2 === false)
		{
			signX = -signX;
			padTouch2 = true;			
		}
		if (distBallPad2(x + signX*dx, y + signY*dy) > 0)				
			padTouch2 = false;								
	}		
	else if (distBallPad1(x, y) <= 0)
	{
		if (padTouch1 === false)
		{
			signX = -signX;
			padTouch1 = true;						
		}			
		if (distBallPad1(x + signX*dx, y + signY*dy) > 0)		
			padTouch1 = false;				
	}	
    // next
	if (!loose1 && !loose2)
	{
		x = x + signX*dx;
		y = y + signY*dy;		
	}
	else
	{
		x = canvasWidth / 2;
		y = canvasHeight / 2;
		loose1 = false;
		loose2 = false;		
		signX = getRandomSign();
		signY = getRandomSign();
	}
    //
    gameState.ball.x  = x
	gameState.ball.y  = y
	return (gameState);
    // clt_skt.send(JSON.stringify(gameState));    
	//requestAnimationFrame(draw);
}

// setInterval(play, 50);

/******
************** tools  
************/


function getRandomIntInclusive(min, max)
{
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
}

function getRandomSign()
{
	let s = getRandomIntInclusive(0, 1);
	if (s === 0)
		return (1);
	else 
		return (-1);
}

function distBallPad2(xB, yB)
{
	const xP = canvasWidth - paddleWidth;
	const yP = paddle2Y + paddleHeight;	

	if (yB >= paddle2Y && yB <= yP)	
		return (xP - (xB + ballRadius));	
	if (yB > yP)
		return (Math.sqrt((xB - xP) * (xB - xP) + (yB - yP) * (yB - yP)) - ballRadius);
	if (yB < paddle2Y)
		return (Math.sqrt((xB - xP) * (xB - xP) + (yB - paddle2Y) * (yB - paddle2Y)) - ballRadius);		
}

function distBallPad1(xB, yB)
{
	const xP = paddleWidth;
	const yP = paddle1Y + paddleHeight;	

	if (yB >= paddle1Y && yB <= yP)		
		return ((xB - ballRadius) - xP);	
	if (yB > yP)
		return (Math.sqrt((xB - xP) * (xB - xP) + (yB - yP) * (yB - yP)) - ballRadius);
	if (yB < paddle1Y)
		return (Math.sqrt((xB - xP) * (xB - xP) + (yB - paddle1Y) * (yB - paddle1Y)) - ballRadius);		
}



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