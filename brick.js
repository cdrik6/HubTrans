/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   brick.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: caguillo <caguillo@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/06/02 21:36:04 by caguillo          #+#    #+#             */
/*   Updated: 2025/06/03 01:04:52 by caguillo         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let ballRadius = 10;
let d = -2;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;
let signX = 1;
let signY = 1;
let paddleHeight = 80, paddleWidth = 15;
let paddle1Y = (canvas.height - paddleHeight) / 2;
let paddle2Y = (canvas.height - paddleHeight) / 2;
var upPressed1 = false;
var downPressed1 = false;
var upPressed2 = false;
var downPressed2 = false;
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function drawBall() {	
	ctx.beginPath();		
	ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
	ctx.fillStyle = "#0095DD";
	ctx.fill();
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
	// ctx.beginPath();
	// ctx.arc(240, 160, 50, 0, Math.PI * 2, false);
	// ctx.fillStyle = "#FF0000";
	// ctx.fill();
	// // ctx.lineWidth = 1;
	// // ctx.arc(260, 200, 10, 0, Math.PI * 2, false);
	// // ctx.fillStyle = "green";
	// // ctx.fill();
	// d = -d
	// ctx.lineWidth = 20 - d;
	// ctx.strokeStyle = "rgba(0, 0, 0, 1)";	
	// ctx.stroke();	
	// ctx.closePath();	
	drawBall();
	if (x + ballRadius >= canvas.width || x - ballRadius <= 0)
		signX = -signX;
	if (y + ballRadius >= canvas.height || y - ballRadius <= 0)
		signY = -signY;	
	x = x + signX*dx;
	y = y + signY*dy;	
	//
	if (upPressed2 == true)
	{
		if (paddle2Y > 0 )
			paddle2Y = paddle2Y - 1;		
	}
	if (downPressed2 == true)
	{
		if (paddle2Y + paddleHeight < canvas.height )
			paddle2Y = paddle2Y + 1;
	}
	if (upPressed1 == true)
	{
		if (paddle1Y > 0 )
			paddle1Y = paddle1Y - 1;		
	}
	if (downPressed1 == true)
	{
		if (paddle1Y + paddleHeight < canvas.height )
			paddle1Y = paddle1Y + 1;
	}	
	drawPaddles(); 	
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
  else if (e.key == "z") {
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
  else if (e.key == "z") {
    downPressed1 = false;	
  }
}


setInterval(draw, 10);
