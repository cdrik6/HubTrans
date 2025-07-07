// API for pong game
// curl "http://localhost:3000/hello?toto=tata"

export default async function pongRoutes(fast, options)
{
	fast.get('/hello', async (request, reply) => {
			const toto = request.query.toto || 'titi';
			reply.send({ message: `Hello ${toto}!` }); 
			//reply.send("Hello\n"); 
		}
	);

	fast.get('/game/ball', async (request, reply) => {
			const toto = request.query.toto || 'titi';
			reply.send({ message: `Hello ${toto}!` }); 
		}
	);

	fast.get('/game/start', async (req, res) => {
    	const gameState = game.start(); // however you start a game
    	return gameState;
	});

	
}
