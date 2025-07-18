export class Game {

	constructor(id)
	{
		this.id = id;
		this.players = [null, null];
		this.users = [null, null];
		this.canvasHeight = 320;
		this.canvasWidth = 480;
		this.ballRadius = this.canvasHeight / 40;
		this.paddleHeight = this.canvasHeight / 5;
		this.paddleWidth = 3 * this.canvasHeight / 80;
		this.ballSpeed = 3;
		this.padSpeed = 3;
		this.fq = 10;
		this.dx = this.ballSpeed;
		this.dy = this.ballSpeed;
		this.signX = getRandomSign();
		this.signY = getRandomSign();
		this.lost1 = false;
		this.lost2 = false;
		this.paddle1Y = (this.canvasHeight - this.paddleHeight) / 2; 
		this.paddle2Y = (this.canvasHeight - this.paddleHeight) / 2;
		this.padTouch1 = false;
		this.padTouch2 = false;
		this.corner = false;
		this.x = this.canvasWidth / 2;
		this.y = this.canvasHeight / 2;
		this.s1 = 0;
		this.s2 = 0;
		this.gameState = {
			ball: {x: this.x / this.canvasWidth, y: this.y / this.canvasHeight},
			paddle: {p1: this.paddle1Y / this.canvasHeight, p2: this.paddle2Y / this.canvasHeight},
			score: {p1: this.s1, p2: this.s2},
			winner: ""
		};
		this.settings = {
			bR: this.ballRadius / this.canvasHeight,
			pH: this.paddleHeight / this.canvasHeight,
			pW: this.paddleWidth / this.canvasHeight
		};
		this.intervalId = null;
		this.startGame = false;
		this.ready = 0;
		this.mode = 1;
		this.limit = 5;
	}

	// get paddles movements from client
	paddlesY(pad1, pad2)
	{
		if (pad2 === "up" && this.paddle2Y > 0)
			this.paddle2Y -= this.padSpeed;
		else if (pad2 === "down" && this.paddle2Y + this.paddleHeight < this.canvasHeight)		
			this.paddle2Y += this.padSpeed;
		else if (pad1 === "up" && this.paddle1Y > 0 )	
			this.paddle1Y -= this.padSpeed;
		else if (pad1 === "down" && this.paddle1Y + this.paddleHeight < this.canvasHeight)	
			this.paddle1Y += this.padSpeed;	
		this.gameState.paddle.p2 = this.paddle2Y / this.canvasHeight;
		this.gameState.paddle.p1 = this.paddle1Y / this.canvasHeight;
	}	
	
	
	check()
	{
		if (this.x + this.ballRadius >= this.canvasWidth)
		{
			this.lost2 = true;
			this.s1++;
			this.gameState.score.p1 = this.s1;			
			if (this.s1 >= this.limit && this.s1 - this.s2 >= 2)
			{
				this.gameState.winner = "p1";
				clearInterval(this.intervalId);
			}	
		}
		else if (this.x - this.ballRadius <= 0)
		{
			this.lost1 = true;
			this.s2++;
			this.gameState.score.p2 = this.s2;
			if (this.s2 >= this.limit && this.s2 - this.s1 >= 2)
			{
				this.gameState.winner = "p2";
				clearInterval(this.intervalId);
			}	
		}	
		else if (this.y + this.ballRadius >= this.canvasHeight || this.y - this.ballRadius <= 0)
			this.signY = -this.signY;						
		else if (this.distBallPad2(this.x, this.y) <= 0)
		{
			// console.log("distBallPad2(" + this.id + ") <= 0, padTouch2 = " + this.padTouch2 + " " + d2);			
			if (this.padTouch2 === false)
			{
				this.signX = -this.signX;
				if (this.corner === true)
					this.signY = -this.signY;			
				this.padTouch2 = true;
				// console.log("la padTouch2 = " + this.padTouch2);
			}			
		}		
		else if (this.distBallPad1(this.x, this.y) <= 0)		
		{
			//  console.log("distBallPad1(" + this.id + ") <= 0, padTouch1 = " + this.padTouch1 + " " + d1);
			if (this.padTouch1 === false)
			{
				this.signX = -this.signX;
				if (this.corner === true)
					this.signY = -this.signY;
				this.padTouch1 = true;						
			}
		}
	}
	
	next()
	{
		if (!this.lost1 && !this.lost2 && this.gameState.winner === "")
		{
			this.x = this.x + this.signX*this.dx;
			this.y = this.y + this.signY*this.dy;		
			// reset padTouch crossing the middle
			if (this.canvasWidth / 2 - this.ballRadius <= this.x && this.x <= this.canvasWidth / 2 + this.ballRadius)
			{
				this.padTouch2 = false;
				this.padTouch1 = false;
			}	
		}
		else
		{
			this.x = this.canvasWidth / 2;
			this.y = this.canvasHeight / 2;
			this.lost1 = false;
			this.lost2 = false;		
			this.signX = getRandomSign();
			this.signY = getRandomSign();
			this.padTouch2 = false;
			this.padTouch1 = false;
			//this.start(false);
		}	
	}

	play()
	{
		if (this.gameState.winner === "")
		{		
			this.check();
			this.next();
			this.gameState.ball.x = this.x / this.canvasWidth;
			this.gameState.ball.y = this.y / this.canvasHeight;	
			// console.log(gameState);
		}
		else		
			clearInterval(this.intervalId);		 
		return (this.gameState);    		
	}

	distBallPad2(xB, yB)
	{
		const xP = this.canvasWidth - this.paddleWidth;
		const yP = this.paddle2Y + this.paddleHeight;	

		if (yB >= this.paddle2Y && yB <= yP)	
			return (this.corner = false, xP - (xB + this.ballRadius));	
		if (yB > yP)
			return (this.corner = true, Math.sqrt((xB - xP) * (xB - xP) + (yB - yP) * (yB - yP)) - this.ballRadius);
		if (yB < this.paddle2Y)
			return (this.corner = true, Math.sqrt((xB - xP) * (xB - xP) + (yB - this.paddle2Y) * (yB - this.paddle2Y)) - this.ballRadius);
	}

	distBallPad1(xB, yB)
	{
		const xP = this.paddleWidth;
		const yP = this.paddle1Y + this.paddleHeight;	

		if (yB >= this.paddle1Y && yB <= yP)		
			return (this.corner = false, (xB - this.ballRadius) - xP);	
		if (yB > yP)
			return (this.corner = true, Math.sqrt((xB - xP) * (xB - xP) + (yB - yP) * (yB - yP)) - this.ballRadius);
		if (yB < this.paddle1Y)
			return (this.corner = true, Math.sqrt((xB - xP) * (xB - xP) + (yB - this.paddle1Y) * (yB - this.paddle1Y)) - this.ballRadius);
	}


	start(startGame)
	{
		this.startGame = startGame;
		if (this.startGame === true && this.ready === 1)
		{			
			this.intervalId = setInterval( () => 
			{				
				const frame = JSON.stringify(this.play());
				if (this.mode === 2 && this.players[0].readyState === this.players[0].OPEN)
						this.players[0].send(frame);
				else
				{
					for (let clt_skt of this.players)
					{
						if (clt_skt.readyState === clt_skt.OPEN)
							clt_skt.send(frame);
					}
				} 
			}, this.fq);			
		}
		else 
			clearInterval(this.intervalId);
	}
	
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
