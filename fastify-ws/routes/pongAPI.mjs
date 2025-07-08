// API for pong game
// curl "http://localhost:3000/hello?toto=tata"

export default async function pongRoutes(fast, options)
{
	fast.get('/hello', async (request, reply) => {
			// const name = request.query.name || 'titi';
			// reply.send({ message: "Hello " + name + "!" });
			reply.send({message: "Hello"}); 
		}
	);

	fast.get('/game/ball', async (request, reply) => {
			const game = fast.apiGame;
			const gameState = game.gameState; //game.play();
			return (gameState);
		}
	);

	
}

// fast.post('/game/move', async (req, reply) => {
//         const game = fast.apiGame;
//         const { player, direction } = req.body; // e.g., { player: 'p1', direction: 'up' }
//         game.move(player, direction); // you implement this logic
//         return game.gameState;
//     });