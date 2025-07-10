import { Game } from '../Game.mjs'
const apigamesById = new Map();
let apiId = 0;

// API for pong game
// curl "http://localhost:3000/hello?toto=tata"

export default async function pongRoutes(fast, options)
{
	// For testing
	fast.get('/hello', async (request, reply) => {
			// const name = request.query.name || 'titi';
			// reply.send({ message: "Hello " + name + "!" });
			reply.send({ message: "Hello Pong API!" }); 
		}
	);

	// **** how to protect for infinite post requests ??? *************/
	fast.post('/game/init', async (request, reply) => {
			if (apiId < 20)
			{
				const game = new Game(apiId);
				apigamesById.set(apiId, game);
				game.ready = 1;
				game.mode = 2;
				apiId++;
				game.intervalId = setInterval( () => { game.play();	}, game.fq);			
				reply.send({ id: game.id, bR: 1/40, pH: 1/5, pW: 3/80 });
			}	
		}
	);
	
	fast.post('/game/paddles', async (request, reply) => {			
			const { id, p1, p2 } = request.body;
			if (isNaN(Number(id)))
				return(reply.code(400).send({ error: 'Invalid or missing Game ID' }));	
			const game = apigamesById.get(id);
			if (!game)			
				return(reply.code(404).send({ error: 'Game not found' }));			
			// const pad1 = request.query.p1;
			// const pad2 = request.query.p2;
			// if (!pad1 || !pad2)
			// 	return(reply.code(400).send({ error: 'Invalid paddle movement' }));
			game.paddlesY(p1, p2);
			// reply.send(game.gameState);
			reply.send({ success: true });
		}
	);

	

	// from /game/state?id=0
	fast.get('/game/state', async (request, reply) => {
			const id = Number(request.query.id);
			if (isNaN(id))
				return(reply.code(400).send({ error: 'Invalid or missing Game ID' }));	
			const game = apigamesById.get(id);
			if (!game)			
				return(reply.code(404).send({ error: 'Game not found' }));			
			reply.send(game.gameState);
		}
	);

	// from /game/winner?id=0
	fast.get('/game/winner', async (request, reply) => {
			const id = Number(request.query.id);
			if (isNaN(id))
				return(reply.code(400).send({ error: 'Invalid or missing Game ID' }));	
			const game = apigamesById.get(id);
			if (!game)			
				return(reply.code(404).send({ error: 'Game not found' }));			
			reply.send(game.gameState);
		}
	);
	
}

// fast.post('/game/move', async (req, reply) => {
//         const game = fast.apiGame;
//         const { player, direction } = req.body; // e.g., { player: 'p1', direction: 'up' }
//         game.move(player, direction); // you implement this logic
//         return game.gameState;
//     });