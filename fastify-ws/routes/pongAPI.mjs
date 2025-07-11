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
		if (apiId < 20)
		{
			const game = new Game(apiId);
			apigamesById.set(apiId, game);
			game.ready = 1;
			game.mode = 2;
			apiId++;			
			reply.send({ id: game.id, bR: 1/40, pH: 1/5, pW: 3/80 });
		}
		else {
  			reply.code(429).send({ error: 'Max number of games reached' });}	
	});

	fast.post('/game/start', async (request, reply) => {			
		const { id, startGame } = request.body;
		if (isNaN(Number(id)))
			return(reply.code(400).send({ error: 'Invalid or missing Game ID' }));
		if (typeof startGame !== 'boolean')
  			return(reply.code(400).send({ error: 'Missing or invalid startGame type' }));
		const game = apigamesById.get(id);
		if (!game)			
			return(reply.code(404).send({ error: 'Game not found' }));			
		if (startGame)
		{
			game.intervalId = setInterval( () => { game.play();	}, game.fq);
			reply.send({ message: "started" });
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
			return(reply.code(400).send({ error: 'Invalid or missing Game ID' }));	
		const game = apigamesById.get(id);
		if (!game)			
			return(reply.code(404).send({ error: 'Game not found' }));					
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
		reply.send({ winner: game.gameState.winner });
	});	
}
