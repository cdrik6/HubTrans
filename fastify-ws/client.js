const output = document.getElementById('output');

document.getElementById('canvas').onclick = () => {
	const clt_skt = new WebSocket('ws://localhost:3000/pong');

	// clt_skt.addEventListener('open', () => {
	// 	output.textContent += 'Connected to WebSocket\n';
	// 	clt_skt.send('Hello from client');
	// });

	// clt_skt.addEventListener('message', event => {
	// 	output.textContent += 'Received ici: ' + event.data + '\n';
	// });

	clt_skt.addEventListener('close', () => {
		output.textContent += 'WebSocket closed\n';
	});

	clt_skt.addEventListener('error', err => {
	output.textContent += 'Error: ' + err + '\n';
	});

	clt_skt.addEventListener('message', event => {
		try {
			const data = JSON.parse(event.data);
    		console.log('Ball position:', data.ball.x, data.ball.y);
			drawBall(data.ball.x, data.ball.y)
    		//console.log('Score P2:', data.score.p2);
		}
		catch (e) {
			console.error('Invalid JSON received:', event.data);
		}		
	});

	clt_skt.addEventListener('open', () => {
		// output.textContent += 'Connected to WebSocket\n';
		// clt_skt.send('Hello from client');
		clt_skt.send(JSON.stringify(paddles));
	});
};

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
const ballRadius = 10;

function drawBall(x, y) {	
	ctx.beginPath();		
	ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
	ctx.fillStyle = "rgba(255, 0, 0, 1)";
	ctx.fill();	
	ctx.closePath();		
}

let paddles = {
    pad: {p1:10, p2:20}    
}


// Event name
// "open" = When the connection is established
// "message" = When a message is received
// "error" = When there's an error
// "close" = When the connection closes