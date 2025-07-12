// API for pong game
// curl "http://localhost:3000/hello?name=toto"

import { Game } from '../Game.mjs'
const apigamesById = new Map();
let apiId = 0;

export default async function pongRoutes(fast, options)
{
	// from /hello for testing
	fast.get('/hello', async (request, reply) => {		
		reply.send({ message: "Hello from Pong API!" });
	});

	// **** how to protect for infinite post requests ??? *************/
	fast.post('/game/init', async (request, reply) => {
			// deleteGameOver();
		// if (apiId < 20)
		// {
			const game = new Game(apiId);
			apigamesById.set(apiId, game);
			game.ready = 1;
			game.mode = 2;
			apiId++;			
			reply.send({ id: game.id, bR: 1/40, pH: 1/5, pW: 3/80 });
		// }
		// else {
  		// 	reply.code(429).send({ error: 'Max number of games reached' });}	
		// deleteGameOver();
	});

	fast.post('/game/start', async (request, reply) => {			
		const { id, startGame } = request.body;
		if (typeof startGame !== 'boolean')
			  return(reply.code(400).send({ error: 'Missing or invalid startGame type' }));
		if (isNaN(Number(id)))
			return(reply.code(400).send({ error: 'Invalid or missing Game ID' }));
		const game = apigamesById.get(id);
		if (!game)
			return(reply.code(404).send({ error: 'Game not found' }));			
		// const game = getGameById(Number(id));
		if (startGame && game.gameState.winner === "")
		{
			game.intervalId = setInterval( () => { game.play();	}, game.fq);
			reply.send({ message: "started" });
		}
		else if (game.gameState.winner !== "")
		{
			clearInterval(game.intervalId);
			game.intervalId = null;	
			reply.send({ message: "Game Over" });
			console.log(game.id + " deleted");		
			apigamesById.delete(game.id);
		}
		else
		{
			clearInterval(game.intervalId);
			game.intervalId = null;	
			reply.send({ message: "paused" });
		}				
	});
	
	fast.post('/game/paddles', async (request, reply) => {			
		const { id, p1, p2 } = request.body;
		if (isNaN(Number(id)))
			return (reply.code(400).send({ error: 'Invalid or missing Game ID' }));	
		const game = apigamesById.get(id);
		if (!game)			
			return (reply.code(404).send({ error: 'Game not found' }));
		// const game = getGameById(Number(id));
		game.paddlesY(p1, p2);		
		reply.send({ success: true });
	});	

	// from /game/state?id=0
	fast.get('/game/state', async (request, reply) => {
		const id = Number(request.query.id);
		if (isNaN(id))
			return(reply.code(400).send({ error: 'Invalid or missing Game ID' }));	
		const game = apigamesById.get(id);
		if (!game)			
			return(reply.code(404).send({ error: 'Game not found' }));			
		// const game = getGameById(Number(request.query.id));
		reply.send(game.gameState);
	});

	// from /game/winner?id=0
	fast.get('/game/winner', async (request, reply) => {
		const id = Number(request.query.id);
		if (isNaN(id))
			return(reply.code(400).send({ error: 'Invalid or missing Game ID' }));	
		const game = apigamesById.get(id);
		if (!game)			
			return(reply.code(404).send({ error: 'Game not found' }));
		// const game = getGameById(Number(request.query.id));
		reply.send({ winner: game.gameState.winner });
	});	

	function getGameById(id)
	{
		if (isNaN(id))
			return (reply.code(400).send({ error: 'Invalid or missing Game ID' }));	
		const game = apigamesById.get(id);
		if (!game)			
			return (reply.code(404).send({ error: 'Game not found' }));
		return (game);
	}

	function deleteGameOver()
	{
		for (const game of apigamesById.values())
		{
			if (game.gameState.winner !== "" && game.intervalId !== null)
			{
				console.log(game.id + " deleted");
				clearInterval(game.intervalId);
				game.intervalId = null;
				apigamesById.delete(game.id);
			}				
		}
	}

}
