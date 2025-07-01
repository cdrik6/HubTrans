import { Game } from './Game.js'
// import pongRoutes from './routes/pong.js';
const gamesById = new Map();
const gamesByClient = new Map();
const gamesByUser = new Map();
let id = 0;

/***************************************************************************************/
/*************************** Server Fastify with WS*************************************/
/***************************************************************************************/

import fastify from 'fastify';
const fast = fastify();
import { WebSocketServer } from 'ws';
import http from 'http';

// // For the API
// await fast.register(pongRoutes);

// Both Fastify and WebSocket share the same port and server instance
fast.ready().then(() => {
  
    const server = http.createServer((req, res) => {
        fast.routing(req, res);
    });
    
    // bind websocketserver to the http server
    const srv_wskt = new WebSocketServer({ server, path:'/pong' });    

    srv_wskt.on('connection', (clt_skt, res) => {
		
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
            }
            catch (e)
			{
                console.error('Invalid JSON from client');
            }
        });                

		clt_skt.on('close', () => {
			const game = gamesByClient.get(clt_skt);
			if (game)
			{
				console.log('Server: Client disconnected in game: ' + game.id);
				gamesByClient.delete(clt_skt);
				// // delete game if both disconnected
				// if ((game.players[0] && game.players[0].readyState !== WebSocket.OPEN) 
				// 	&& (game.players[1] && game.players[1].readyState !== WebSocket.OPEN))
				// {
				// 	game.end();
				// 	gamesById.delete(game.id);
				// 	gamesByClient.delete(game.players[0]);
				// 	gamesByClient.delete(game.players[1]);
				// 	gamesByClient.delete(game.users[0]);
				// 	gamesByClient.delete(game.users[1]);
				// 	console.log('Server: Game ' + game.id + 'deleted');
				// }
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
	console.log('nbPlayers:', data.nbPlayers);
	console.log('userId:', data.userId);
	if (data.nbPlayers !== null && data.userId !== null)
	{
		const temp = gamesByUser.get(data.userId)
		if (temp)
			BackToGame(clt_skt, data, temp);
		else
		{
			if (data.nbPlayers === 2)
				ModeLocal(clt_skt, data);	
			else if	(data.nbPlayers === 1)	
				ModeRemote(clt_skt, data);
		}
	}	
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
		temp.players[0] = clt_skt;
		temp.players[1] = clt_skt;
	}
	else 
	{
		if (data.userId === temp.users[0])
			temp.players[0] = clt_skt;
		else if (data.userId === temp.users[1])
			temp.players[1] = clt_skt;		
	}		
	gamesByClient.set(clt_skt, temp);	
	clt_skt.send(JSON.stringify(temp.settings))
	console.log(temp.settings);
}

function ModeRemote(clt_skt, data)
{		
	let newGame = true;
	if (id > 0) // at least one game created									
		newGame = JoinGame(clt_skt, data, newGame);		
	if (id === 0 || newGame === true)
		NewGame(clt_skt, data);
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

function PaddleInData(clt_skt, data)
{
	const game = gamesByClient.get(clt_skt);					
	if (game)
	{
		console.log('gameid: ' + game.id);
		if (game.mode === 2)
		{
			// console.log('pad1:', data.p1);
			// console.log('pad2:', data.p2);				
			game.paddlesY(data.p1, data.p2);
		}
		else 
		{
			if (game.players[0] === clt_skt)															
				game.paddlesY(data.p1, "");								
			else if (game.players[1] === clt_skt)
				game.paddlesY("", data.p2);							
		}
	}
}

function StartInData(clt_skt)
{
	const game = gamesByClient.get(clt_skt);					
	console.log("game id start/pause: " + game.id);					
	if (game)
	{
		if (game.startGame === true)
			game.start(false);
		else 
			game.start(true);						
	}
}

// // id <-> game <-> clt_skt
// function getGame(clt_skt)
// {
// 	for (const game of gamesById.values())
// 	{
// 		if (game.players[0] === clt_skt || game.players[1] === clt_skt)
// 			return (game);
// 	}
// 	return (null);
// }
