import { Game } from './Game.js'
const gamesById = new Map();
// const gamesByClient = new Map();
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
    

    srv_wskt.on('connection', (clt_skt, res) => {
		
		clt_skt.on('open', () => {
			console.log('Server: Client connected');		
		});		
		
		clt_skt.on('message', clt_msg => {           
            console.log('Server received:', clt_msg.toString());            
			const data = JSON.parse(clt_msg);
            try
			{					
				if ('nbPlayers' in data)
				{
					console.log('nbPlayers:', data.nbPlayers);
					if (data.nbPlayers === 2)
					{
						const game = new Game(id);
						gamesById.set(id, game);
						// gamesByClient.set(clt_skt, game);
						console.log('Server: New game with 2 players: ' + id );
						id++;						
						game.players[0] = clt_skt;
						game.players[1] = clt_skt;
						game.ready = 1;
						game.mode = 2;
						clt_skt.send(JSON.stringify(game.settings))
						console.log(game.settings);
					}
					else if	(data.nbPlayers === 1)
					{						
						let newGame = true;
						if (id > 0) // at least one game created
						{							
							for (const game of gamesById.values())
							{								
								// console.log("mode ready " + game.mode + " " + game.ready);
								if (game.ready === 0 && game.mode === 1)
								{
									game.players[1] = clt_skt;
									game.ready = 1;
									console.log('Server: game: ' + game.id + ' found 2nd player');
									// gamesByClient.set(clt_skt, game);
									newGame = false;
									clt_skt.send(JSON.stringify(game.settings))
									console.log(game.settings);
								}								
							}
						}
						if (id === 0 || newGame === true)
						{							
							const game = new Game(id);
							gamesById.set(id, game);
							// gamesByClient.set(clt_skt, game);
							console.log('Server: New game with 1 player: ' + id );		
							game.players[0] = clt_skt;
							game.ready = 0;
							game.mode = 1;
							id++;
							clt_skt.send(JSON.stringify(game.settings))
							console.log(game.settings);
						}
					}					
				}
				else if ('p1' in data && 'p2' in data)
				{
					// const game = gamesByClient.get(clt_skt);
					const game = getGame(clt_skt);
					if (game)
					{
						console.log('paddles: ' + game.id);
						if (game.mode === 2)
						{
							console.log('pad1:', data.p1);
							console.log('pad2:', data.p2);				
							game.paddlesY(data.p1, data.p2);
						}
						else 
						{
							if (game.players[0] === clt_skt)							
								game.paddlesY(data.p1, data.p2);
								// game.paddlesY(data.p1, "");								
							else if (game.players[1] === clt_skt)	
								game.paddlesY(data.p1, data.p2);						
								// game.paddlesY("", data.p2);							
						}
					}
				}
				else if ('start' in data)
				{
					// const game = gamesByClient.get(clt_skt);
					const game = getGame(clt_skt);
					console.log("game id start/pause: " + game.id);					
					if (game)
					{						
						if (game.startGame === true)
							game.start(false);
						else 
							game.start(true);
						
						// // client version
						// if (game.players[0] === clt_skt)
						// 	console.log(game.id + ': P1 start: ' + data.start);
						// else if (game.players[1] === clt_skt)
						// 	console.log(game.id + ': P2 start: ' + data.start);
						// // game.startGame = data.start;
						// game.start(data.start);

						//
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
				}				
            }
            catch (e)
			{
                console.error('Invalid JSON from client');
            }
        });                

		clt_skt.on('close', () => {
			// const game = gamesByClient.get(clt_skt);		
			const game = getGame(clt_skt);
			if (game)
			{
				console.log('Server: Client disconnected');
				if (game.players[0] && game.players[0].readyState === game.players[0].OPEN)
					game.players[0].send(JSON.stringify({dis:"other client disconnected"}));
				// gamesByClient.delete(game.players[0]);					
				if (game.players[1] && game.players[1].readyState === game.players[1].OPEN)
						game.players[1].send(JSON.stringify({dis:"other client disconnected"}));
				// gamesByClient.delete(game.players[1]);				
				game.end();
				gamesById.delete(game.id);
				console.log("id deleted: " + game.id);
			}			
		});

	});
	

    server.listen(3000, () => {
        console.log("Server listening");
    });	
});  

// id <-> game <-> clt_skt
function getGame(clt_skt)
{
	for (const game of gamesById.values())
	{
		if (game.players[0] === clt_skt || game.players[1] === clt_skt)
			return (game);
	}
	return (null);
}