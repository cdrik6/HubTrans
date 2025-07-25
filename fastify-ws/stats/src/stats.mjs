import fastify from 'fastify';
import sqlite3 from 'sqlite3';
import { execute } from './sql.mjs';
const fast = fastify({ logger: true });
const PORT = 3000;
const HOST = '0.0.0.0';

import statsRoutes from './statsAPI.mjs';
// For the API, ensures routes are registered before the server is ready
await fast.register(statsRoutes);

const db = new sqlite3.Database('stats.db'); // default sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);

async function set_db()
{
	try {
        await execute(db, `CREATE TABLE IF NOT EXISTS game
                    (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        gameid INTEGER NOT NULL UNIQUE,
                        player1 TEXT NOT NULL,
                        player2 TEXT NOT NULL,
                        winner TEXT NOT NULL,
                        score1 INTEGER NOT NULL,
                        score2 INTEGER NOT NULL,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    )`          
        );
        console.log("Table game created (if not exists)")
    }
    catch (err) {
        console.log(err);
    }    
}

set_db();

export { db };

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
