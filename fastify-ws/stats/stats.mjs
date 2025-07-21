import fastify from 'fastify';
import sqlite3 from "sqlite3";
const fast = fastify({ logger: true });
const PORT = 443;
const HOST = '0.0.0.0';
const signals = ['SIGINT', 'SIGTERM'];

const db = new sqlite3.Database('stats.db');
// default sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);

signals.forEach((signal) => {
    process.on(signal, async () =>
	{
    	try {
            await fast.close();
            // await closeDb(db);
            // console.log("Stats DB and Server closed")
            process.exit(0);
        }
		catch (err) {
            console.error("Error closing users: ", err);
        }
    });
});

/*************************** */

async function set_db()
{
	try {
        await execute(
            db, `CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                is_active BOOLEAN NOT NULL DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`
        );
        console.log("Database users created (if not exists)")
    } catch (error) {
            console.log(error);
    }
}

set_db();


db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player TEXT NOT NULL,
    score INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

db.close();

/**************** */


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
