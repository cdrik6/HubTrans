/***************************************************************************************/
/************************************** variables declaration for PONG *****************/
/***************************************************************************************/

let canvasHeight = 320;
let canvasWidth = 480;
let ballRadius = canvasHeight / 40;
let paddleHeight = canvasHeight / 5;
let paddleWidth = 3 * canvasHeight / 80; // 3 * ballRadius / 2;
const ballSpeed = 3;
const padSpeed = 6;
const tpf = 10; // frequence for setInterval
let dx = ballSpeed;
let dy = ballSpeed;
let signX = getRandomSign();
let signY = getRandomSign();
let lost1 = false;
let lost2 = false;
let paddle1Y = (canvasHeight - paddleHeight) / 2; 
let paddle2Y = (canvasHeight - paddleHeight) / 2;
let padTouch1 = false;
let padTouch2 = false;
let corner = false;
let x = canvasWidth / 2;
let y = canvasHeight / 2;
let s1 = 0;
let s2 = 0;
let gameState = {
	ball: {x: x / canvasWidth, y: y / canvasHeight},
	paddle: {p1: paddle1Y / canvasHeight, p2: paddle2Y / canvasHeight},
	score: {p1:s1, p2:s2}
}
let settings = {
	bR: ballRadius / canvasHeight,
	pH: paddleHeight / canvasHeight,
	pW: paddleWidth / canvasHeight
}
let intervalId = null;
let startGame = false;



/***************************************************************************************/
/*************************** Server Fastify ********************************************/
/***************************************************************************************/

// const fastify = require('fastify')();
import fastify from 'fastify';
const fast = fastify();
// const ws = require('ws');
// const WebSocketServer = ws.WebSocketServer;
// const { WebSocketServer } = require('ws'); // just the WebSocketServer part of the ws module
import { WebSocketServer } from 'ws';
// const http = require('http');
import http from 'http';

// http route
fast.get('/hello', async (request, reply) => {
        const toto = request.query.toto || 'titi';
        reply.send({ message: `Hello ${toto}!` }); 
    }
);

// http server from Fastify who will manage http requests so far
// const server = http.createServer(fastify); // --> not good, only for express
fast.ready().then(() => {
  
    const server = http.createServer((req, res) => {
        fast.routing(req, res);
    });
    
    // bind websocketserver to the http server
    const srv_wskt = new WebSocketServer({ server , path: '/pong' });
    let clts = new Set();

    srv_wskt.on('connection', (clt_skt, res) => {        
        console.log('Server: Client connected');
		clt_skt.send(JSON.stringify(settings))
		console.log(settings);
		if (clts.size < 2) // 2 players max --> check multiplayer version
			clts.add(clt_skt);
		//
		clt_skt.on('close', () => {
            console.log('Server: Client disconnected');
			clts.delete(clt_skt);
        });
		//
		clt_skt.on('message', clt_msg => {           
            console.log('Server received:', clt_msg.toString());
            // paddles from client			
			const data = JSON.parse(clt_msg);
            try
			{                
				if ('p1' in data && 'p2' in data)
				{
					console.log('pad1:', data.p1);
					console.log('pad2:', data.p2);				
					paddlesY(data.p1, data.p2);
				}
				else if ('start' in data)
				{
					console.log('start:', data.start);															
					startGame = data.start;
					// framing(startGame, clts)
					if (startGame === true )
					{
						intervalId = setInterval( () => 
						{
							const frame = JSON.stringify(play());
							for (let clt_skt of clts)
							{
								if (clt_skt.readyState === clt_skt.OPEN)
									clt_skt.send(frame);
							};		
						}, tpf);
					}
					else 
						clearInterval(intervalId);
				}	
            }
            catch (e) {
                console.error('Invalid JSON from client');
            }
        });                
	});		
	

    server.listen(3000, () => {
        console.log("Server listening");
    });	
});  

// function framing(startGame, clts)
// {	

// 	if (startGame === true )
// 	{
// 		intervalId = setInterval( () => 
// 		{
// 			const frame = JSON.stringify(play());
// 			for (let clt_skt of clts)
// 			{
// 				if (clt_skt.readyState === clt_skt.OPEN)
// 					clt_skt.send(frame);
// 			};		
// 		}, tpf);
// 	}
// 	else 
// 		clearInterval(intervalId);
// }


/***************************************************************************************/
/*************************** Pong game *************************************************/
/***************************************************************************************/

function sizePlayground(width, height)
{
	canvasHeight = height;
	canvasWidth = width;
	ballRadius = canvasHeight / 40;
	paddleHeight = canvasHeight / 4;
	paddleWidth = 3 * ballRadius / 2;
	settings.bR = ballRadius;
	settings.pH = paddleHeight;
	settings.pW = paddleWidth;
	console.log(settings.bR);	
}

// get paddles movements from client
function paddlesY(pad1, pad2)
{
	if (pad2 === "up" && paddle2Y > 0)	// does not go under limit because moved before of padSpeed	
		paddle2Y -= padSpeed;
	if (pad2 === "down" && paddle2Y + paddleHeight < canvasHeight)		
		paddle2Y += padSpeed;
	if (pad1 === "up" && paddle1Y > 0 )	
		paddle1Y -= padSpeed;
	if (pad1 === "down" && paddle1Y + paddleHeight < canvasHeight)	
		paddle1Y += padSpeed;	
	gameState.paddle.p2 = paddle2Y / canvasHeight;
	gameState.paddle.p1 = paddle1Y / canvasHeight;
}
// gameState.pad = {p1:paddle1Y, p2:paddle2Y};	

// playing pong
function play()
{	
    // check
	if (x + ballRadius >= canvasWidth)
	{
		lost2 = true;
		s1++;
		gameState.score.p1 = s1;
	}
	else if (x - ballRadius <= 0)
	{
		lost1 = true;
		s2++;
		gameState.score.p2 = s2;
	}	
	else if (y + ballRadius >= canvasHeight || y - ballRadius <= 0)	
		signY = -signY;		
	else if (distBallPad2(x, y) <= 0) 
	{
		if (padTouch2 === false)
		{
			signX = -signX;
			if (corner === true)
				signY = -signY;			
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
			if (corner === true)
				signY = -signY;
			padTouch1 = true;						
		}			
		if (distBallPad1(x + signX*dx, y + signY*dy) > 0)		
			padTouch1 = false;				
	}	
    // next
	if (!lost1 && !lost2)
	{
		x = x + signX*dx;
		y = y + signY*dy;		
	}
	else
	{
		x = canvasWidth / 2;
		y = canvasHeight / 2;
		lost1 = false;
		lost2 = false;		
		signX = getRandomSign();
		signY = getRandomSign();
	}
    //
    gameState.ball.x  = x / canvasWidth;
	gameState.ball.y  = y / canvasHeight;	
	// console.log(gameState);
	return (gameState);    
	//requestAnimationFrame(draw);
}
// setInterval(play, 50);


/***************************************************************************************/
/*************************** Tools *****************************************************/
/***************************************************************************************/

// The maximum is inclusive and the minimum is inclusive
function getRandomIntInclusive(min, max)
{
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);   
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
		return (corner = false, xP - (xB + ballRadius));	
	if (yB > yP)
		return (corner = true, Math.sqrt((xB - xP) * (xB - xP) + (yB - yP) * (yB - yP)) - ballRadius);
	if (yB < paddle2Y)
		return (corner = true, Math.sqrt((xB - xP) * (xB - xP) + (yB - paddle2Y) * (yB - paddle2Y)) - ballRadius);		
}

function distBallPad1(xB, yB)
{
	const xP = paddleWidth;
	const yP = paddle1Y + paddleHeight;	

	if (yB >= paddle1Y && yB <= yP)		
		return (corner = false, (xB - ballRadius) - xP);	
	if (yB > yP)
		return (corner = true, Math.sqrt((xB - xP) * (xB - xP) + (yB - yP) * (yB - yP)) - ballRadius);
	if (yB < paddle1Y)
		return (corner = true,Math.sqrt((xB - xP) * (xB - xP) + (yB - paddle1Y) * (yB - paddle1Y)) - ballRadius);		
}
