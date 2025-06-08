const fastify = require('fastify')();
// const ws = require('ws');
// const WebSocketServer = ws.WebSocketServer;
const { WebSocketServer } = require('ws'); // just the WebSocketServer part of the ws module
const http = require('http');

// http route
fastify.get('/hello', async (request, reply) => {
        const toto = request.query.toto || 'titi';
        reply.send({ message: `Hello ${toto}!` }); 
    }
);

// http server from Fastify who will manage http requests so far
// const server = http.createServer(fastify); // --> not good, for express
fastify.ready().then(() => {
  
    const server = http.createServer((req, res) => {
        fastify.routing(req, res);
    });
    
    // bind websocketserver to the http server
    const srv_skt = new WebSocketServer({ server , path: '/pong' });
    
    srv_skt.on('connection', (clt_skt, res) => {        
        console.log('Server: Client connected');
        //
        clt_skt.on('message', message => { 
            /////////
            // clt_skt.send('Hello Fastify WebSockets');
            clt_skt.send(JSON.stringify(gameState));
            console.log('Server received:', message.toString());
            // paddles from client
            try {
                const data = JSON.parse(message);
                console.log('pad1:', data.pad.p1);
                console.log('pad2:', data.pad.p2);
            }
            catch (e) {
                console.error('Invalid JSON from client');
            }
        });
        //
        clt_skt.on('close', () => {
            console.log('Server: Client disconnected');
        });
    });

    server.listen(3000, () => {
        console.log("Server listening");
    });
});  

// fastify.listen({port:3000}, (err, address) => {
//     if(err) {
//         console.error(err);
//         process.exit(1);
//     }
//     console.log(`Server listening at: ${address}`);    
// });

let gameState = {
    ball: {x:100, y:200}
    //score: {p1:1, p2:2}
}

