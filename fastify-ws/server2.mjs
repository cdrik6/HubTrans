import { Game } from './Game.js'
const games = {}; // --> map
let id = 0;

/***************************************************************************************/
/*************************** Server Fastify ********************************************/
/***************************************************************************************/

import fastify from 'fastify';
const fast = fastify();
import { WebSocketServer } from 'ws';
import http from 'http';

// http route
fast.get('/hello', async (request, reply) => {
        const toto = request.query.toto || 'titi';
        reply.send({ message: `Hello ${toto}!` }); 
    }
);

fast.ready().then(() => {
  
    const server = http.createServer((req, res) => {
        fast.routing(req, res);
    });
    
    // bind websocketserver to the http server
    const srv_wskt = new WebSocketServer({ server , path: '/pong' });
    //let clts = new Set();

    srv_wskt.on('connection', (clt_skt, res) => {
		
		console.log('Server: Client connected');

		// if (id > 0 && games[id].status == 0)
		// {

		// }
		// else
		// {
			const game = new Game(id, clt_skt, clt_skt);
			games[id] = game; 
			id++;

		// } 	

		clt_skt.send(JSON.stringify(game.settings))
		console.log(game.settings);

		// if (clts.size < 2) // 2 players max --> check multiplayer version
		// 	clts.add(clt_skt);
		//
		clt_skt.on('close', () => {
            console.log('Server: Client disconnected');
			// clts.delete(clt_skt);
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
					game.paddlesY(data.p1, data.p2);
				}
				else if ('start' in data)
				{
					console.log('start:', data.start);															
					game.startGame = data.start;
					game.start();
					// // framing(startGame, clts)
					// if (startGame === true )
					// {
					// 	intervalId = setInterval( () => 
					// 	{
					// 		const frame = JSON.stringify(play());
					// 		for (let clt_skt of clts)
					// 		{
					// 			if (clt_skt.readyState === clt_skt.OPEN)
					// 				clt_skt.send(frame);
					// 		};		
					// 	}, fq);
					// }
					// else 
					// 	clearInterval(intervalId);
				}				
				else if ('nb_players' in data)
				{
					console.log('nb_players:', data.nb_players);
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
