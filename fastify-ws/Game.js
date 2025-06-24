let game = {
	canvasHeight: 320,
	canvasWidth: 480,
	ballRadius: canvasHeight / 40,
	paddleHeight: canvasHeight / 5,
	paddleWidth: 3 * canvasHeight / 80, // 3 * ballRadius / 2;
	ballSpeed: 3,
	padSpeed: 6,
	tpf: 10, // frequence for setInterval
	dx: ballSpeed,
	dy: ballSpeed,
	signX: getRandomSign(),
	signY: getRandomSign(),
	lost1: false,
	lost2: false,
	paddle1Y: (canvasHeight - paddleHeight) / 2, 
	paddle2Y: (canvasHeight - paddleHeight) / 2,
	padTouch1: false,
	padTouch2: false,
	corner: false,
	x: canvasWidth / 2,
	y: canvasHeight / 2,
	s1: 0,
	s2: 0,
	gameState: {
		ball: {x: x / canvasWidth, y: y / canvasHeight},
		paddle: {p1: paddle1Y / canvasHeight, p2: paddle2Y / canvasHeight},
		score: {p1:s1, p2:s2}
	},
	settings: {
		bR: ballRadius / canvasHeight,
		pH: paddleHeight / canvasHeight,
		pW: paddleWidth / canvasHeight
	},
	intervalId: null,
	startGame: false
}

game.play = play;
game.paddlesY = paddlesY;

/***************************************************************************************/
/*************************** Pong game *************************************************/
/***************************************************************************************/

// get paddles movements from client
function paddlesY(pad1, pad2)
{
	if (pad2 === "up" && paddle2Y > 0)	// does not go under limit because moved before of padSpeed	
		paddle2Y -= padSpeed;
	if (pad2 === "down" && paddle2Y + paddleHeight < canvasHeight)		
		paddle2Y += padSpeed;
	if (pad1 === "up" && paddle1Y > 0 )	
		paddle1Y -= padSpeed;
	if (pad1 === "down" && paddle1Y + paddleHeight < canvasHeight)	
		paddle1Y += padSpeed;	
	gameState.paddle.p2 = paddle2Y / canvasHeight;
	gameState.paddle.p1 = paddle1Y / canvasHeight;
}
// gameState.pad = {p1:paddle1Y, p2:paddle2Y};	

// playing pong
function play()
{	
    // check
	if (x + ballRadius >= canvasWidth)
	{
		lost2 = true;
		s1++;
		gameState.score.p1 = s1;
	}
	else if (x - ballRadius <= 0)
	{
		lost1 = true;
		s2++;
		gameState.score.p2 = s2;
	}	
	else if (y + ballRadius >= canvasHeight || y - ballRadius <= 0)	
		signY = -signY;		
	else if (distBallPad2(x, y) <= 0) 
	{
		if (padTouch2 === false)
		{
			signX = -signX;
			if (corner === true)
				signY = -signY;			
			padTouch2 = true;			
		}
		if (distBallPad2(x + signX*dx, y + signY*dy) > 0)				
			padTouch2 = false;								
	}		
	else if (distBallPad1(x, y) <= 0)
	{
		if (padTouch1 === false)
		{
			signX = -signX;
			if (corner === true)
				signY = -signY;
			padTouch1 = true;						
		}			
		if (distBallPad1(x + signX*dx, y + signY*dy) > 0)		
			padTouch1 = false;				
	}	
    // next
	if (!lost1 && !lost2)
	{
		x = x + signX*dx;
		y = y + signY*dy;		
	}
	else
	{
		x = canvasWidth / 2;
		y = canvasHeight / 2;
		lost1 = false;
		lost2 = false;		
		signX = getRandomSign();
		signY = getRandomSign();
	}
    //
    gameState.ball.x  = x / canvasWidth;
	gameState.ball.y  = y / canvasHeight;	
	// console.log(gameState);
	return (gameState);    
	//requestAnimationFrame(draw);
}


/***************************************************************************************/
/*************************** Tools *****************************************************/
/***************************************************************************************/

// The maximum is inclusive and the minimum is inclusive
function getRandomIntInclusive(min, max)
{
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);   
}

function getRandomSign()
{
	let s = getRandomIntInclusive(0, 1);
	if (s === 0)
		return (1);
	else 
		return (-1);
}

function distBallPad2(xB, yB)
{
	const xP = canvasWidth - paddleWidth;
	const yP = paddle2Y + paddleHeight;	

	if (yB >= paddle2Y && yB <= yP)	
		return (corner = false, xP - (xB + ballRadius));	
	if (yB > yP)
		return (corner = true, Math.sqrt((xB - xP) * (xB - xP) + (yB - yP) * (yB - yP)) - ballRadius);
	if (yB < paddle2Y)
		return (corner = true, Math.sqrt((xB - xP) * (xB - xP) + (yB - paddle2Y) * (yB - paddle2Y)) - ballRadius);		
}

function distBallPad1(xB, yB)
{
	const xP = paddleWidth;
	const yP = paddle1Y + paddleHeight;	

	if (yB >= paddle1Y && yB <= yP)		
		return (corner = false, (xB - ballRadius) - xP);	
	if (yB > yP)
		return (corner = true, Math.sqrt((xB - xP) * (xB - xP) + (yB - yP) * (yB - yP)) - ballRadius);
	if (yB < paddle1Y)
		return (corner = true,Math.sqrt((xB - xP) * (xB - xP) + (yB - paddle1Y) * (yB - paddle1Y)) - ballRadius);		
}
