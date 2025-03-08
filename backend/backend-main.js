const apiRequests = require('./api-requests');
const WebSocket = require('ws');
const { initGameSocket } = require('./game-feed');
let authToken;
const frontendWss = new WebSocket.Server({ port: 7071 });
const clients = new Map(); // holds all active WS connections


// hold onto data here
let latestTop8Data = null;

// init server
frontendWss.on('connection', (ws) => {
    
    const id = Date.now();
    const color = Math.floor(Math.random() * 360);
    const metadata = { id, color };
    clients.set(ws, metadata);
    ws.onmessage = (msg)=>{
        handleWsMessage(msg);
    };
});

// inits after main.js call
function initServerMain(token){
    console.log("init server main");
    authToken = token;
   initGameSocket();
}

function handleWsMessage(msg){
    console.log("mesage recieved");
    if(! msg?.data) {
        console.error("no data found in mesage");
    }
    request = JSON.parse(msg.data);
    console.log( msg.data);

    if (request.requestType == "getTop8Data"){
        if(!latestTop8Data){
            startTop8Data();
        }
    }
}

function startTop8Data(){
    latestTop8Data = apiRequests.pollTop8Data(authToken, request.slug);
    const top8UpdateTimer = setInterval(updateTop8, 60 * 1000);
}

function updateTop8() {
 apiRequests.updateTop8(authToken);
}


module.exports = {
    initServerMain:initServerMain
}