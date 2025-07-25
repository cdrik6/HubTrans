import { db } from './stats.mjs'
import { execute } from './sql.mjs';

export default async function statsRoutes(fast, options)
{	
	fast.post('/stats', async (request, reply) => {			
		const { gameid, player1, player2, winner, score1, score2 } = request.body;		
		const data = { gameid, player1, player2, winner, score1, score2 };		
		// check data
		if (typeof player1 !== 'string' || typeof player2 !== 'string' || typeof winner !== 'string')
			  return (reply.code(400).send({ error: 'Invalid type to insert' }));
		if (isNaN(gameid) || isNaN(score1) || isNaN(score2))
			return (reply.code(400).send({ error: 'Invalid type to insert' }));
		if (typeof gameid !== 'number' || typeof score1 !== 'number' || typeof score2 !== 'number')
			return (reply.code(400).send({ error: 'Invalid type to insert' }));
		// insert data
		try
		{
			await insertData(data);
			reply.code(201).send({ message: "Data of game inserted in stats.db"});
		}
		catch (err)
		{
			console.error(err);
			reply.code(500).send({ error: "Insertion failed"});
		}		
	});	
}

async function insertData(data)
{
	const sql = `INSERT INTO game (gameid, player1, player2, winner, score1, score2) VALUES (?, ?, ?, ?, ?, ?)`;
	await execute(db, sql, [data.gameid, data.player1, data.player2, data.winner, data.score1, data.score2]);
}