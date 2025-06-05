/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   brick.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: caguillo <caguillo@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/06/02 21:36:04 by caguillo          #+#    #+#             */
/*   Updated: 2025/06/06 00:57:26 by caguillo         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

let canvas = document.getElementById("myCanvas");
let para1 = document.getElementById("myP1");
let para2 = document.getElementById("myP2");
let ctx = canvas.getContext("2d");
let ballRadius = 10;
let d = -2;
let x = canvas.width / 2;
let y = canvas.height / 2;
const ballSpeed = 3;
let dx = ballSpeed; //* getRandomSign();
let dy = ballSpeed; //* getRandomSign();
let signX = getRandomSign();
let signY = getRandomSign();
let paddleHeight = 80, paddleWidth = 3* ballRadius / 2;
let paddle1Y = (canvas.height - paddleHeight) / 2;
let paddle2Y = (canvas.height - paddleHeight) / 2;
let upPressed1 = false;
let downPressed1 = false;
let upPressed2 = false;
let downPressed2 = false;
let loose1 = false;
let loose2 = false;
// let padTouch1 = false;
// let padTouch2 = false;
const padSpeed = 3;
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function drawBall() {	
	ctx.beginPath();		
	ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
	ctx.fillStyle = "rgba(255, 0, 0, 1)";
	ctx.fill();
	// ctx.arc(x-2*signX, y-2*signY, ballRadius, 0, Math.PI * 2);
	// ctx.fillStyle = "rgba(255, 0, 0, 0.6)";
	// ctx.fill();
	// ctx.arc(x-4*signX, y-4*signY, ballRadius, 0, Math.PI * 2);
	// ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
	// ctx.fill();
	ctx.closePath();	
}

function drawPaddles() {
  ctx.beginPath();
  ctx.rect(0, paddle1Y, paddleWidth, paddleHeight);
  ctx.rect(canvas.width - paddleWidth, paddle2Y, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);	  		
	drawBall();
	drawPaddles();
	 
	// check
	if (x + ballRadius >= canvas.width) // - paddleWidth)
		loose2 = true; // signX = -signX;
	else if (x - ballRadius <= 0) //paddleWidth)
		loose1 = true; // signX = -signX;
	else if (y + ballRadius == canvas.height || y - ballRadius == 0)
	{
		signY = -signY;
		// signX = getRandomSign();	--> option
	}
	// else if (x + ballRadius*0 + paddleWidth >= canvas.width && y + ballRadius*0 >= paddle2Y && y + ballRadius*0 <= paddle2Y + paddleHeight)		
	// {
	// 	signX = -signX;
	// 	// signY = getRandomSign();
	// 	// padTouch1 = true;
	// }
	// else if (x - ballRadius*0 - paddleWidth <= 0 && y + ballRadius*0 >= paddle1Y && y + ballRadius*0 <= paddle1Y + paddleHeight)
	// {
	// 	signX = -signX;
	// 	// signY = getRandomSign();
	// 	// padTouch2 = true;
	// }
	// else if (x + ballRadius + paddleWidth > canvas.width && distBallPad2() < 0)
	// else if (distBallPad2() <= 0)
	// {
	// 	signX = -signX;
	// 	// para2.innerHTML = distBallPad2();
	// 	console.log("pad2: " + distBallPad2());
	// }
	else if (x + ballRadius + signX*dx > canvas.width - paddleWidth) // if next time ...
	{
		if (paddle2Y <= y && y <= paddle2Y + paddleHeight)
			signX = -signX;
	}	
	// else if (x - ballRadius - paddleWidth <	 0 && distBallPad1() < 0)
	// else if (distBallPad1() <= 0)
	// {
	// 	signX = -signX;
	// 	// para1.innerHTML = distBallPad1();
	// 	console.log("pad1: " + distBallPad1());
	// }
	else if (x - ballRadius + signX*dx < paddleWidth) // if next time ...
	{
		if (paddle1Y <= y && y <= paddle1Y + paddleHeight)
			signX = -signX;
	}
		
	// next
	if (!loose1 && !loose2)
	{
		x = x + signX*dx;
		y = y + signY*dy;		
	}
	else
	{
		x = canvas.width / 2; //+ signX*dx;
		y = canvas.height / 2; //+ signY*dy;	
		loose1 = false;
		loose2 = false;
		dx = ballSpeed; // * getRandomSign(); // console.log(dx);
		dy = ballSpeed; // * getRandomSign(); // console.log(dy);
		signX = getRandomSign();
		signY = getRandomSign();
	}
	padMovement();	
	requestAnimationFrame(draw);
}

// function checkPad1()
// {
// 	if (x + ballRadius > )
// }

function padMovement()
{
	if (upPressed2 == true)
	{
		if (paddle2Y > 0 )
			paddle2Y = paddle2Y - padSpeed;		
	}
	if (downPressed2 == true)
	{
		if (paddle2Y + paddleHeight < canvas.height )
			paddle2Y = paddle2Y + padSpeed;
	}
	if (upPressed1 == true)
	{
		if (paddle1Y > 0 )
			paddle1Y = paddle1Y - padSpeed;		
	}
	if (downPressed1 == true)
	{
		if (paddle1Y + paddleHeight < canvas.height )
			paddle1Y = paddle1Y + padSpeed;
	}
	
}

function keyDownHandler(e) {
  if (e.key == "Up" || e.key == "ArrowUp") {
    upPressed2 = true;
  }
  else if (e.key == "Down" || e.key == "ArrowDown") {
    downPressed2 = true;	
  }
  else if (e.key == "w") {
    upPressed1 = true;	
  }
  else if (e.key == "x") {
    downPressed1 = true;	
  }
}

function keyUpHandler(e) {
  if (e.key == "Up" || e.key == "ArrowUp") {
    upPressed2 = false;
  }
  else if (e.key == "Down" || e.key == "ArrowDown") {
    downPressed2 = false;
  }
  else if (e.key == "w") {
    upPressed1 = false;	
  }
  else if (e.key == "x") {
    downPressed1 = false;	
  }
}

// setInterval(draw, 20);
draw();

function getRandomIntInclusive(min, max)
{
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
}

function getRandomSign()
{
	let s = getRandomIntInclusive(0, 1);
	if (s ==0)
		return (1);
	else 
		return (-1);
}

function distBallPad2()
{
	const xP = canvas.width - paddleWidth;
	const yP = paddle2Y + paddleHeight;	

	if (y >= paddle2Y && y <= yP)	
		return (xP - (x + ballRadius));	
	if (y > yP)
		return (Math.sqrt((x - xP) * (x - xP) + (y - yP) * (y - yP)) - ballRadius);
	if (y < paddle2Y)
		return (Math.sqrt((x - xP) * (x - xP) + (y - paddle2Y) * (y - paddle2Y)) - ballRadius);		
}

function distBallPad1()
{
	const xP = paddleWidth;
	const yP = paddle1Y + paddleHeight;	

	if (y >= paddle1Y && y <= yP)		
		return ((x - ballRadius) - xP);	
	if (y > yP)
		return (Math.sqrt((x - xP) * (x - xP) + (y - yP) * (y - yP)) - ballRadius);
	if (y < paddle1Y)
		return (Math.sqrt((x - xP) * (x - xP) + (y - paddle1Y) * (y - paddle1Y)) - ballRadius);		
}