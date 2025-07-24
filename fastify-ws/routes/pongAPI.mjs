// API for pong game
// curl "http://localhost:3000/hello"

import { Game } from '../game/Game.mjs'
const apigamesById = new Map();
let apiId = 0;

export default async function pongRoutes(fast, options)
{
	// from /hello for testing
	fast.get('/hello', async (request, reply) => {		
		reply.send({ message: "Hello from Pong API!" });
	});
	
	fast.post('/game/init', async (request, reply) => {
		deleteGameOver();
		if (apigamesById.size <= 100)
		{
			const game = new Game(apiId);
			apigamesById.set(apiId, game);
			game.ready = 1;
			game.mode = 2;
			apiId++;			
			reply.send({ id: game.id, bR: 1/40, pH: 1/5, pW: 3/80 });
		}
		else 
  			reply.code(429).send({ error: 'Max number of games reached' });	
		// deleteGameOver();
		// timeOut
	});

	fast.post('/game/start', async (request, reply) => {			
		const { id, startGame } = request.body;
		if (typeof startGame !== 'boolean')
			  return (reply.code(400).send({ error: 'Missing or invalid startGame type' }));
		if (isNaN(Number(id)))
			return (reply.code(400).send({ error: 'Invalid or missing Game ID' }));		
		const game = apigamesById.get(Number(id));		
		if (!game)
			return (reply.code(400).send({ error: 'Game not found' }));		
		if (startGame && game.gameState.winner === "")
		{
			game.intervalId = setInterval( () => { game.play();	}, game.fq);
			reply.send({ message: "started" });
		}
		else
		{		
			clearInterval(game.intervalId);
			game.intervalId = null;	
			if (game.gameState.winner === "")			
				reply.send({ message: "paused" });
			else			
				reply.send({ message: "Game Over" });			
		}
	});
	
	fast.post('/game/paddles', async (request, reply) => {			
		const { id, p1, p2 } = request.body;
		if (isNaN(Number(id)))
			return (reply.code(400).send({ error: 'Invalid or missing Game ID' }));	
		const game = apigamesById.get(Number(id));
		if (!game)			
			return (reply.code(400).send({ error: 'Game not found' }));				
		game.paddlesY(p1, p2);		
		reply.send({ success: true });
	});	

	// from /game/state?id=0
	fast.get('/game/state', async (request, reply) => {
		const id = request.query.id;
		if (isNaN(Number(id)))
			return (reply.code(400).send({ error: 'Invalid or missing Game ID' }));	
		const game = apigamesById.get(Number(id));
		if (!game)			
			return (reply.code(400).send({ error: 'Game not found' }));
		reply.send(game.gameState);
	});

	// from /game/winner?id=0
	fast.get('/game/winner', async (request, reply) => {
		const id = request.query.id;
		if (isNaN(Number(id)))
			return (reply.code(400).send({ error: 'Invalid or missing Game ID' }));	
		const game = apigamesById.get(Number(id));
		if (!game)			
			return (reply.code(400).send({ error: 'Game not found' }));				
		reply.send({ winner: game.gameState.winner });
	});
	
	fast.post('/game/delete', async (request, reply) => {
		const { id } = request.body;
		if (isNaN(Number(id)))
			return (reply.code(400).send({ error: 'Invalid or missing Game ID' }));	
		const game = apigamesById.get(Number(id));
		if (!game)			
			return (reply.code(400).send({ error: 'Game not found' }));
		clearInterval(game.intervalId);
		game.intervalId = null;
		console.log("Game " + game.id + " deleted");
		reply.send({ message: "Game " + game.id + " deleted" });
		apigamesById.delete(game.id);
	});	

	function deleteGameOver()
	{
		for (const game of apigamesById.values())
		{
			if (game.gameState.winner !== "") // && game.intervalId !== null)
			{
				console.log(game.id + " deleted");
				clearInterval(game.intervalId);
				game.intervalId = null;
				apigamesById.delete(game.id);
			}				
		}
	}
}

// function getGameById(id, reply)
// {
// 	if (isNaN(id))
// 		return (reply.code(400).send({ error: 'Invalid or missing Game ID' }));	
// 	const game = apigamesById.get(id);
// 	if (!game)			
// 		return (reply.code(404).send({ error: 'Game not found' }));
// 	return (game);
// }