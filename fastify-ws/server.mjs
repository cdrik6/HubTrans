/***************************************************************************************/
/*************************** Server Fastify with WS ************************************/
/***************************************************************************************/

import fastify from 'fastify';
import { WebSocketServer } from 'ws';
import http from 'http';
const fast = fastify({ logger: true });

/***************************************************************************************/
/*************************** Game class and Maps    ************************************/
/***************************************************************************************/

import { Game } from './Game.mjs'
import { Game4 } from './Game4.mjs'
const gamesById = new Map();
const gamesByClient = new Map();
const gamesByUser = new Map();
let id = 0;
let localId = 0;

// /***************************************************************************************/
// /*************************** Temp: To serve index.html with fastify ********************/
// /***************************************************************************************/

// import path from 'path';
// import { fileURLToPath } from 'url';
// import fastifyStatic from '@fastify/static';
// const filename = fileURLToPath(import.meta.url);
// const dirname = path.dirname(filename);
// // Register static plugin
// await fast.register(fastifyStatic, { root: path.join(dirname, 'public') });

// /***************************************************************************************/
// /*************************** Temp: Allow cross-origin requests *************************/
// /***************************************************************************************/

// // API called from a web page running on a different origin (domain/port/protocol)
// import fastifyCors from '@fastify/cors';
// await fast.register(fastifyCors, { origin: '*' });
// // need to be restricted to specific domains

/***************************************************************************************/
/*************************** Routes from API *******************************************/
/***************************************************************************************/

import pongRoutes from './routes/pongAPI.mjs';

// // API client gets its own "game"
// const apiGame = new Game();
// // const apiGame = gamesById.get(0);
// fast.decorate('apiGame', apiGame);

// For the API, ensures routes are registered before the server is ready
await fast.register(pongRoutes);

/***************************************************************************************/
/*************************** Server running ********************************************/
/***************************************************************************************/

// const listeners = ['SIGINT', 'SIGTERM'];
// listeners.forEach((signal) => {
//     process.on(signal, async () => {
//         await fast.close();
//         process.exit(0);
//     });
// });

// Both Fastify and WebSocket share the same port and server instance
fast.ready().then(() => {     	
	
	const server = http.createServer((req, res) => {		
        fast.routing(req, res);
    });
    
    // bind websocketserver to the http server
    const srv_wskt = new WebSocketServer({ server, path:'/pong' });    

    srv_wskt.on('connection', (clt_skt, req) => {
		// // const ip = req.socket.remoteAddress;
		// ip = req.socket.remoteAddress;

		clt_skt.on('open', () => {
			console.log('Server: Client connected');			
		});		
		
		clt_skt.on('error', () => {
			console.log('Server: Error');		
		});
		
		clt_skt.on('message', clt_msg => {           
            console.log('Server received:', clt_msg.toString());            
			const data = JSON.parse(clt_msg);
            try
			{					
				if ('nbPlayers' in data && 'userId'in data)				
					ModeInData(clt_skt, data);
				else if ('p1' in data && 'p2' in data)				
					PaddleInData(clt_skt, data);				
				else if ('start' in data)									
					StartInData(clt_skt);
				else if ('end' in data)									
					EndInData(clt_skt);

            }
            catch (e)
			{
                console.error('Invalid JSON from client');
            }
        });                

		clt_skt.on('close', (code, reason) => {
			console.log("Server: Client disconnected (" + code + "): " + reason + "\n");
			const game = gamesByClient.get(clt_skt);
			if (game)
			{
				console.log("Server: Client disconnected in game: " + game.id + " " + reason + "\n");				
				gamesByClient.delete(clt_skt);				
			}
		});

	});	

    server.listen(3000, () => {
        console.log("Server listening");
    });	
});

//
function ModeInData(clt_skt, data)
{
	
	if (data.userId === "")
	{
		data.userId = "local_" + localId;
		localId++;
	}
	console.log('nbPlayers:', data.nbPlayers);
	console.log('userId:', data.userId);
	if ((data.nbPlayers === 1 || data.nbPlayers === 2 || data.nbPlayers === 4) && data.userId !== null)
	{
		const temp = gamesByUser.get(data.userId)
		if (temp)
			BackToGame(clt_skt, data, temp);		
		else
		{
			if (data.nbPlayers === 2)
				ModeLocal(clt_skt, data);	
			else
				ModeRemote(clt_skt, data);			
		}
	}
	else
		clt_skt.close(1000, "Closed, wrong mode!");
}

function ModeLocal(clt_skt, data)
{
	const game = new Game(id);
	gamesById.set(id, game);
	gamesByClient.set(clt_skt, game);
	gamesByUser.set(data.userId, game);
	console.log('Server: New game with 2 players: ' + id );
	id++;						
	game.players[0] = clt_skt;
	game.players[1] = clt_skt;
	game.users[0] = data.userId;
	game.users[1] = data.userId;
	game.ready = 1;
	game.mode = 2;
	clt_skt.send(JSON.stringify(game.settings))
	console.log(game.settings);
}

function BackToGame(clt_skt, data, temp)
{
	if (temp.mode === 2)
	{
		temp.players[0].close(1000, "Bye2: ws of user:" + temp.users[0] + " is now closed");
		temp.players[0] = clt_skt;
		temp.players[1] = clt_skt;
	}
	else if (temp.mode === 1)
	{
		if (data.userId === temp.users[0])
		{
			temp.players[0].close(1000, "Bye1: ws of user:" + temp.users[0] + " is now closed");
			temp.players[0] = clt_skt;
		}	
		else if (data.userId === temp.users[1])
		{
			temp.players[1].close(1000, "Bye1: ws of user:" + temp.users[1] + " is now closed");
			temp.players[1] = clt_skt;		
		}
	}
	else if (temp.mode === 4)
	{
		if (data.userId === temp.users[0])
		{
			temp.players[0].close(1000, "Bye4: ws of user:" + temp.users[0] + " is now closed");
			temp.players[0] = clt_skt;
		}	
		else if (data.userId === temp.users[1])
		{
			temp.players[1].close(1000, "Bye4: ws of user:" + temp.users[1] + " is now closed");
			temp.players[1] = clt_skt;		
		}
		else if (data.userId === temp.users[2])
		{
			temp.players[2].close(1000, "Bye4: ws of user:" + temp.users[2] + " is now closed");
			temp.players[2] = clt_skt;		
		}
		else if (data.userId === temp.users[3])
		{
			temp.players[3].close(1000, "Bye4: ws of user:" + temp.users[3] + " is now closed");
			temp.players[3] = clt_skt;		
		}
	}		
	gamesByClient.set(clt_skt, temp);	
	clt_skt.send(JSON.stringify(temp.settings))
	console.log(temp.settings);
}

function ModeRemote(clt_skt, data)
{		
	let newGame = true;
	if (id > 0) // at least one game created
	{
		if (data.nbPlayers === 1)
			newGame = JoinGame(clt_skt, data, newGame);
		else if (data.nbPlayers === 4)
			newGame = JoinGame4(clt_skt, data, newGame);
	}
	if (id === 0 || newGame === true)
	{
		if (data.nbPlayers === 1)
			NewGame(clt_skt, data);
		else if (data.nbPlayers === 4)
			NewGame4(clt_skt, data);
	}	
}

function JoinGame(clt_skt, data, newGame)
{
	for (const game of gamesById.values())
	{								
		// console.log("mode ready " + game.mode + " " + game.ready);
		if (game.ready === 0 && game.mode === 1)
		{
			game.players[1] = clt_skt;
			game.users[1] = data.userId;
			game.ready = 1;
			console.log('Server: game: ' + game.id + ' found 2nd player');
			gamesByClient.set(clt_skt, game);
			gamesByUser.set(data.userId, game);
			newGame = false;
			clt_skt.send(JSON.stringify(game.settings))
			console.log(game.settings);
			break;
		}									
	}
	return (newGame);
}

function JoinGame4(clt_skt, data, newGame)
{
	for (const game of gamesById.values())
	{								
		// console.log("mode ready " + game.mode + " " + game.ready);
		if (game.ready < 1 && game.mode === 4)
		{
			game.players[game.ready + 3] = clt_skt;
			game.users[game.ready + 3] = data.userId;
			game.ready++;
			console.log('Server: game4: ' + game.id + ' found player ' + game.ready + 3);
			gamesByClient.set(clt_skt, game);
			gamesByUser.set(data.userId, game);
			newGame = false;
			clt_skt.send(JSON.stringify(game.settings))
			console.log(game.settings);
			break;
		}									
	}
	return (newGame);
}

function NewGame(clt_skt, data)
{
	const game = new Game(id);
	gamesById.set(id, game);
	gamesByClient.set(clt_skt, game);
	gamesByUser.set(data.userId, game);
	console.log('Server: New game with 1 player: ' + id );		
	game.players[0] = clt_skt;
	game.users[0] = data.userId;
	game.ready = 0;
	game.mode = 1;
	id++;
	clt_skt.send(JSON.stringify(game.settings))
	console.log(game.settings);
}

function NewGame4(clt_skt, data)
{
	const game = new Game4(id);
	gamesById.set(id, game);
	gamesByClient.set(clt_skt, game);
	gamesByUser.set(data.userId, game);
	console.log('Server: New game4 with 1 player: ' + id );		
	game.players[0] = clt_skt;
	game.users[0] = data.userId;
	game.ready = -2;
	game.mode = 4;
	id++;
	clt_skt.send(JSON.stringify(game.settings))
	console.log(game.settings);
}

function PaddleInData(clt_skt, data)
{
	const game = gamesByClient.get(clt_skt);					
	if (game)
	{
		console.log('gameid: ' + game.id);
		if (game.mode === 2)
		{
			// console.log('pad1:', data.p1);
			// console.log('xpad2:', data.p2);				
			game.paddlesY(data.p1, data.p2);
		}
		else if (game.mode === 1)
		{
			if (game.players[0] === clt_skt)
			{
				// game.paddlesY(data.p1, "");
				if (data.p1 != "")
					game.paddlesY( data.p1, "");
				else if (data.p2 != "")
					game.paddlesY(data.p2, "");
			}
			else if (game.players[1] === clt_skt)
			{
				// game.paddlesY("", data.p2);
				if (data.p2 != "")
					game.paddlesY("", data.p2);
				else if (data.p1 != "")
					game.paddlesY("", data.p1);
			}
		}
		else 
		{
			if (game.players[0] === clt_skt)
			{
				// game.paddlesY(data.p1, "");
				if (data.p1 != "")
					game.paddlesY( data.p1, "");
				else if (data.p2 != "")
					game.paddlesY(data.p2, "");
			}	
			else if (game.players[1] === clt_skt)
			{
				// game.paddlesY("", data.p2);
				if (data.p2 != "")
					game.paddlesY("", data.p2);
				else if (data.p1 != "")
					game.paddlesY("", data.p1);
			}
			else if (game.players[2] === clt_skt)
			{
				// game.paddlesX(data.p3, "");
				if (data.p3 != "")
					game.paddlesX( data.p3, "");
				else if (data.p4 != "")
					game.paddlesX(data.p4, "");

			}
			else if (game.players[3] === clt_skt)
			{
				// game.paddlesX("", data.p4);
				if (data.p4 != "")
					game.paddlesX("", data.p4);
				else if (data.p3 != "")
					game.paddlesX("", data.p3);
			}
		}
	}
}

function StartInData(clt_skt)
{
	const game = gamesByClient.get(clt_skt);					
	console.log("game id start/pause: " + game.id);
	if (game && game.ready === 1)
	{
		if (game.startGame === true)
			game.start(false);
		else 
			game.start(true);						
	}
}

function EndInData(clt_skt)
{
	const game = gamesByClient.get(clt_skt);					
	console.log("game id end: " + game.id);
	if (game)
	{
		if (game.mode === 2)
			game.players[0].close(1000, "Game over");
		else if (game.mode === 2)
		{
			game.players[0].close(1000, "P1 Game over");
			game.players[1].close(1000, "P2 Game over");	
		} 
		else if (game.mode === 4)
		{
			game.players[0].close(1000, "P1 Game over");
			game.players[1].close(1000, "P2 Game over");	
			game.players[2].close(1000, "P3 Game over");
			game.players[3].close(1000, "P4 Game over");
		} 
		gamesById.delete(game.id);
		gamesByClient.delete(game.players[0]);
		gamesByClient.delete(game.players[1]);
		gamesByClient.delete(game.players[2]);
		gamesByClient.delete(game.players[3]);
		gamesByUser.delete(game.users[0]);
		gamesByUser.delete(game.users[1]);
		gamesByUser.delete(game.users[2]);
		gamesByUser.delete(game.users[3]);
		console.log('Server: Game ' + game.id + ' deleted');
	}
}

/*
Note : WebSocket States
CONNECTING (0) -> Connecting in progress
OPEN (1)       -> Ready to send/receive data
CLOSING (2)    -> Close initiated, not done yet
CLOSED (3)     -> Fully closed
*/