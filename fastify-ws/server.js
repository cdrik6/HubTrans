/***************************************************************************************/
/************************************** variables declaration for PONG *****************/
/***************************************************************************************/

let canvasHeight = 320; //--> to be catched ******************************//
let canvasWidth = 480; //--> to be catched ******************************//
let ballRadius = canvasHeight / 40;
let paddleHeight = canvasHeight / 4;
let paddleWidth = 3 * ballRadius / 2;
const ballSpeed = 3;
const padSpeed = 6;
const fps = 10; // frequence for interval
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
let x = canvasWidth / 2;
let y = canvasHeight / 2;
let gameState = {
	ball: {x:x, y:y},
	paddle: {p1:paddle1Y, p2:paddle2Y}
	//score: {p1:1, p2:2}
}
let settings = { bR:ballRadius, pH:paddleHeight, pW:paddleWidth }


/***************************************************************************************/
/*************************** Server Fastify ********************************************/
/***************************************************************************************/

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
            try
			{
                const data = JSON.parse(clt_msg);
				if ('p1' in data && 'p2' in data)
				{
					console.log('pad1:', data.p1);
					console.log('pad2:', data.p2);				
					paddlesY(data.p1, data.p2);
				}
				else if ('w' in data && 'h' in data)
				{
					console.log('w:', data.w);
					console.log('h:', data.h);				
					sizePlayground(data.w, data.h)
					console.log(settings);
					clt_skt.send(JSON.stringify(settings))
				}	
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
	gameState.paddle.p2 = paddle2Y;
	gameState.paddle.p1 = paddle1Y;
}
// gameState.pad = {p1:paddle1Y, p2:paddle2Y};	

// playing pong
function play()
{	
    // check
	if (x + ballRadius >= canvasWidth)
		lost2 = true;
	else if (x - ballRadius <= 0)
		lost1 = true;
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
    gameState.ball.x  = x
	gameState.ball.y  = y
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
