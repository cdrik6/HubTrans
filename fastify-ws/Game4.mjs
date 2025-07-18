export class Game4 {

	constructor(id)
	{
		this.id = id;
		this.players = [null, null, null, null]; // skt1 / skt2 / skt3 / skt4
		this.users = [null, null, null, null]; // p1 / p2 / p3 / p4
		this.canvasHeight = 400;
		this.canvasWidth = 400;
		this.ballRadius = this.canvasHeight / 40;
		this.paddleHeight = this.canvasHeight / 5;
		this.paddleWidth = 3 * this.canvasHeight / 80;
		this.ballSpeed = 1;
		this.padSpeed = 3;
		this.fq = 10;
		this.dx = this.ballSpeed;
		this.dy = this.ballSpeed;
		this.signX = getRandomSign();
		this.signY = getRandomSign();
		//
		this.lost = false;		
		//
		this.paddle1Y = (this.canvasHeight - this.paddleHeight) / 2; 
		this.paddle2Y = (this.canvasHeight - this.paddleHeight) / 2;
		this.paddle3X = (this.canvasWidth - this.paddleHeight) / 2; 
		this.paddle4X = (this.canvasWidth - this.paddleHeight) / 2;
		//
		this.padTouch1 = false;
		this.padTouch2 = false;
		//
		this.corner = false;
		this.x = this.canvasWidth / 2;
		this.y = this.canvasHeight / 2;
		this.s1 = 0;
		this.s2 = 0;
		this.s3 = 0;
		this.s4 = 0;
		this.gameState = {
			ball: {x: this.x / this.canvasWidth, y: this.y / this.canvasHeight},
			paddle: {p1: this.paddle1Y / this.canvasHeight, p2: this.paddle2Y / this.canvasHeight, p3: this.paddle3X / this.canvasWidth, p4: this.paddle4X / this.canvasWidth},
			score: {p1: this.s1, p2: this.s2, p3: this.s3, p4: this.s4},
			winner: ""
		};
		this.settings = {
			bR: this.ballRadius / this.canvasHeight,
			pH: this.paddleHeight / this.canvasHeight,
			pW: this.paddleWidth / this.canvasHeight
		};
		this.intervalId = null;
		this.startGame = false;
		this.ready = -3;
		this.mode = 4;
		this.limit = 11;
		this.lastPaddle = "";
	}

	// get paddles movements from client
	paddlesY(pad1, pad2)
	{
		if (pad1 === "up" && this.paddle1Y > 0 )	
			this.paddle1Y -= this.padSpeed;
		else if (pad1 === "down" && this.paddle1Y + this.paddleHeight < this.canvasHeight)	
			this.paddle1Y += this.padSpeed;
		else if (pad2 === "up" && this.paddle2Y > 0)
			this.paddle2Y -= this.padSpeed;
		else if (pad2 === "down" && this.paddle2Y + this.paddleHeight < this.canvasHeight)		
			this.paddle2Y += this.padSpeed;		
		this.gameState.paddle.p1 = this.paddle1Y / this.canvasHeight;
		this.gameState.paddle.p2 = this.paddle2Y / this.canvasHeight;		
	}	

	paddlesX(pad3, pad4)
	{
		if (pad3 === "left" && this.paddle3X > 0)
			this.paddle3X -= this.padSpeed;
		else if (pad3 === "right" && this.paddle3X + this.paddleHeight < this.canvasWidth)		
			this.paddle3X += this.padSpeed;
		else if (pad4 === "left" && this.paddle4X > 0)
			this.paddle4X -= this.padSpeed;
		else if (pad4 === "right" && this.paddle4X + this.paddleHeight < this.canvasWidth)
			this.paddle4X += this.padSpeed;		
		this.gameState.paddle.p3 = this.paddle3X / this.canvasWidth;
		this.gameState.paddle.p4 = this.paddle4X / this.canvasWidth;
	}	
	
	
	check()
	{
		if (this.x + this.ballRadius >= this.canvasWidth || this.x - this.ballRadius <= 0 
			|| this.y + this.ballRadius >= this.canvasHeight || this.y - this.ballRadius <= 0)
			this.point(this.lastPaddle);
		else if (this.distBallPad4(this.x, this.y) <= 0)		
		{
			this.lastPaddle = "p4";			
			if (this.padTouch4 === false)
			{
				this.signY = -this.signY;
				if (this.corner === true)
					this.signX = -this.signX;
				this.padTouch4 = true;						
			}
		}
		else if (this.distBallPad3(this.x, this.y) <= 0)		
		{
			this.lastPaddle = "p3";
			if (this.padTouch3 === false)
			{
				this.signY = -this.signY;
				if (this.corner === true)
					this.signX = -this.signX;
				this.padTouch3 = true;
			}
		}
		else if (this.distBallPad2(this.x, this.y) <= 0)
		{
			this.lastPaddle = "p2";
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
			this.lastPaddle = "p1";			
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
		if (!this.lost && this.gameState.winner === "")
		{
			this.x = this.x + this.signX * this.dx;
			this.y = this.y + this.signY * this.dy;		
			// reset padTouch crossing the middle
			if (this.canvasWidth / 2 - this.ballRadius <= this.x && this.x <= this.canvasWidth / 2 + this.ballRadius)
			{
				this.padTouch1 = false;
				this.padTouch2 = false;
			}
			if (this.canvasHeight / 2 - this.ballRadius <= this.y && this.y <= this.canvasHeight / 2 + this.ballRadius)
			{
				this.padTouch3 = false;
				this.padTouch4 = false;
			}	
		}
		else
		{
			this.x = this.canvasWidth / 2;
			this.y = this.canvasHeight / 2;
			this.lost = false;			
			this.signX = getRandomSign();
			this.signY = getRandomSign();
			this.padTouch1 = false;
			this.padTouch2 = false;
			this.padTouch3 = false;
			this.padTouch4 = false;
			this.lastPaddle = "";
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

	distBallPad4(xB, yB)
	{
		const xP = this.paddle4X + this.paddleHeight;	
		const yP = this.canvasHeight - this.paddleWidth;

		if (xB >= this.paddle4X && xB <= xP)
			return (this.corner = false, yP - (yB + this.ballRadius));	
		if (xB > xP)
			return (this.corner = true, Math.sqrt((xB - xP) * (xB - xP) + (yB - yP) * (yB - yP)) - this.ballRadius);
		if (xB < this.paddle4X)
			return (this.corner = true, Math.sqrt((yB - yP) * (yB - yP) + (xB - this.paddle4X) * (xB - this.paddle4X)) - this.ballRadius);
	}

	distBallPad3(xB, yB)
	{
		const xP = this.paddle3X + this.paddleHeight;	
		const yP = this.paddleWidth;

		if (xB >= this.paddle3X && xB <= xP)		
			return (this.corner = false, (yB - this.ballRadius) - yP);	
		if (xB > xP)
			return (this.corner = true, Math.sqrt((xB - xP) * (xB - xP) + (yB - yP) * (yB - yP)) - this.ballRadius);
		if (xB < this.paddle3X)
			return (this.corner = true, Math.sqrt((yB - yP) * (yB - yP) + (xB - this.paddle3X) * (xB - this.paddle3X)) - this.ballRadius);
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

	point(lastPaddle)
	{
		this.lost = true;
		if (lastPaddle === "")
			return ;
		if (lastPaddle === "p1")
		{
			this.s1++;
			this.gameState.score.p1 = this.s1;			
			if (this.s1 >= this.limit)
			{
				this.gameState.winner = "p1";
				clearInterval(this.intervalId);
			}
		}	
		else if (lastPaddle === "p2")
		{
			this.s2++;			
			this.gameState.score.p2 = this.s2;
			if (this.s2 >= this.limit)
			{
				this.gameState.winner = "p2";
				clearInterval(this.intervalId);
			}
		}
		else if (lastPaddle === "p3")
		{
			this.s3++;
			this.gameState.score.p3 = this.s3;
			if (this.s3 >= this.limit)
			{
				this.gameState.winner = "p3";
				clearInterval(this.intervalId);
			}
		}
		else if (lastPaddle === "p4")
		{
			this.s4++;
			this.gameState.score.p4 = this.s4;
			if (this.s4 >= this.limit)
			{
				this.gameState.winner = "p4";
				clearInterval(this.intervalId);
			}
		}
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
