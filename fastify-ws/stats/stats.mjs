import fastify from 'fastify';
import sqlite3 from 'sqlite3';
import { execute } from './sql.mjs';

const fast = fastify({ logger: true });
const PORT = 3000;
const HOST = '0.0.0.0';
// const signals = ['SIGINT', 'SIGTERM'];

const db = new sqlite3.Database('stats.db');
// default sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);

// signals.forEach((signal) => {
//     process.on(signal, async () =>
// 	{
//     	try {
//             await fast.close();
//             // await closeDb(db);
//             // console.log("Stats DB and Server closed")
//             process.exit(0);
//         }
// 		catch (err) {
//             console.error("Error closing users: ", err);
//         }
//     });
// });


async function set_db()
{
	try {
        await execute(db, `CREATE TABLE IF NOT EXISTS game
                    (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        gameid INTEGER NOT NULL,
                        player1 TEXT NOT NULL,
                        player2 TEXT NOT NULL,
                        winner TEXT NOT NULL,
                        score1 INTEGER NOT NULL,
                        score2 INTEGER NOT NULL
                    )`          
        );
        console.log("Table game created (if not exists)")
    }
    catch (err) {
        console.log(err);
    }
    finally {
        db.close();
    }
}

set_db();

async function listening()
{
 	try	{
    	await fast.listen({ port: PORT, host: HOST });
		console.log("Server listening on port: " + PORT);
 	}
	catch (err) {
    	console.error("Error starting server: ", err);
    	process.exit(1); 
  	}
}

listening();
