// API for pong game

export default async function pongRoutes(fast, options)
{

	fast.get('/hello', async (request, reply) => {
			const toto = request.query.toto || 'titi';
			reply.send({ message: `Hello ${toto}!` }); 
		}
	);

	// fast.get('/score', async (request, reply) => {
	// 		const toto = request.query.toto || 'titi';
	// 		reply.send({ message: `Hello ${toto}!` }); 
	// 	}
	// );

}
