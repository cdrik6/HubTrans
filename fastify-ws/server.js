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
// const server = http.createServer(fastify); // --> not good, for express
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
            // clt_skt.send(JSON.stringify(gameState));
            console.log('Server received:', clt_msg.toString());
            // paddles from client
            try {
                const data = JSON.parse(clt_msg);
                console.log('pad1:', data.pad.p1);
                console.log('pad2:', data.pad.p2);
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
        setInterval(play(clt_skt), 50);

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

const canvasHeight = 320; const canvasWidth = 480; //--> to be catched ******************************//
const ballRadius = 10; const paddleHeight = 80; const paddleWidth = 3 * ballRadius / 2;
let paddle1Y = (canvasHeight - paddleHeight) / 2; let paddle2Y = (canvasHeight - paddleHeight) / 2;
let x = canvasWidth / 2;
let y = canvasHeight / 2;
const ballSpeed = 3; let dx = ballSpeed; let dy = ballSpeed;
let signX = getRandomSign();
let signY = getRandomSign();
let loose1 = false; let loose2 = false;
let padTouch1 = false; let padTouch2 = false;
let gameState = { ball: {xB:x, yB:y}  //score: {p1:1, p2:2}
}

function play(clt_skt) {
    // check
	if (x + ballRadius >= canvasWidth)
		loose2 = true;
	else if (x - ballRadius <= 0)
		loose1 = true;
	else if (y + ballRadius == canvasHeight || y - ballRadius == 0)	
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
    gameState = { ball: {xB:x, yB:y} }
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
	if (s ==0)
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
