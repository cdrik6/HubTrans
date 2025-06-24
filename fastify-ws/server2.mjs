
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

let gameClass = require(game.mjs);
let game = gameClass();
console.log(game.);


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
