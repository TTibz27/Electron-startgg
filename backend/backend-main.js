const apiRequests = require('./api-requests');
const WebSocket = require('ws');
let authToken;
const wss = new WebSocket.Server({ port: 7071 });
const clients = new Map(); // holds all active WS connections

// init server
wss.on('connection', (ws) => {
    
    const id = uuidv4();
    const color = Math.floor(Math.random() * 360);
    const metadata = { id, color };
    clients.set(ws, metadata);
});


// inits after main.js call
function initServerMain(token){
    console.log("init server main");
    authToken = token;
    apiRequests.pollAllData(authToken);

}



module.exports = {
    initServerMain:initServerMain
}