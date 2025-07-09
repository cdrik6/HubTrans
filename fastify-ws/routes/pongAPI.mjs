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
			const game = new Game(apiId);
			apigamesById.set(apiId, game);
			game.ready = 1;
			game.mode = 2;
			apiId++;
			game.intervalId = setInterval( () => { game.play();	}, game.fq);			
			reply.send({ id: game.id, bR: 1/40, pH: 1/5, pW: 3/80 });
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
	
}

// fast.post('/game/move', async (req, reply) => {
//         const game = fast.apiGame;
//         const { player, direction } = req.body; // e.g., { player: 'p1', direction: 'up' }
//         game.move(player, direction); // you implement this logic
//         return game.gameState;
//     });