GET /hello
Description: get an hello message
Parameters:
Reply:
- success:  { message: "Hello from Pong API!" }
- failure:

POST /game/init
Description: initializes a new game and returns its ID and settings of the playground.
Parameters:
Reply:
- success: 
- failure: 429 + { error: 'Max number of games reached' }

POST /game/start
Description: starts or pauses the game
Parameters: { id, startGame }
Reply:
- success:	{ message: "started" }
			{ message: "paused" }
			{ message: "Game Over" }
- failure:  400 + { error: 'Missing or invalid startGame type' }
			400 + { error: 'Invalid or missing Game ID' }
			400 + { error: 'Game not found' }			
			
POST /game/paddles --> PUT ???
Description: calculates the positions ot the paddles
Parameters: { id, p1, p2 }
Reply:
- success:	{ success: true }			
- failure:	400 + { error: 'Invalid or missing Game ID' }
			400 + { error: 'Game not found' }

GET /game/state
Description: get the state of the game
Parameters: { id }
Reply:
- success:	gameState JSON
- failure:	400 + { error: 'Invalid or missing Game ID' }
			400 + { error: 'Game not found' }

GET /game/winner
Description: get the winner of the game
Parameters: { id }
Reply:
- success:	winner JSON
- failure:	400 + { error: 'Invalid or missing Game ID' }
			400 + { error: 'Game not found' }

POST /game/delete --> DELETE ???
Description: delete a game
Parameters: { id }
Reply:
- success:	{ message: "Game " + id + " deleted" }
- failure:	400 + { error: 'Invalid or missing Game ID' }
			400 + { error: 'Game not found' }