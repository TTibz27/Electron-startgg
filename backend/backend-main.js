const apiRequests = require('./api-requests');
const WebSocket = require('ws');
const { initGameSocket } = require('./game-feed');
const {MessageType} = require ('./message-type-enum');
const {initCaptureServers} = require("./capture-server");
const {data_top8Data} = require("./api_requested_data");

let authToken;
const frontendWss = new WebSocket.Server({ port: 7071 });
const clients = new Map(); // holds all active WS connections
const top8refreshInterval = 1;

// hold onto data here
let isStartGGPollingActive = false;

// init server
frontendWss.on('connection', (ws) => {
    
    const id = Date.now();

    clients.set(id, ws);
    ws.onmessage = (msg)=>{
        handleWsMessage(msg, ws);
    };
});

// inits after main.js call
function initServerMain(token){
    console.log("init server main");
    authToken = token;
   initGameSocket();
   initCaptureServers();
}

function handleWsMessage(rawMessage, ws){
    console.log("mesage recieved");
    if(! rawMessage?.data) {
        console.error("no data found in mesage");
        return;
    }
   const msg = JSON.parse(rawMessage.data);
    if (msg.type === MessageType.GET_TOP_8_REQUEST){
        if(!isStartGGPollingActive){
           startTop8Data(msg.request?.slug, ws ,(success)=>{
               ws.send(JSON.stringify({
                   type: MessageType.GET_TOP_8_REPLY,
                   reply: success? " API request succeeded!": "Error encountered with API request",
                   success: success
               }));
           });
        }
    }
}

function startTop8Data(slug, ws, callback){
    if (typeof slug !== 'string'){
        ws.send(JSON.stringify({
            type: MessageType.GET_TOP_8_REPLY,
            reply: "Invalid Slug",
            success: false
        }));
        return;
    }

    let success = apiRequests.pollTop8Data(authToken, slug, callback);
    setInterval(updateTop8, top8refreshInterval * 1000);
    isStartGGPollingActive = true;
}

function updateTop8() {
 apiRequests.updateTop8(authToken);
    clients.forEach((ws)=> {
        ws.send(
            JSON.stringify({
                type: MessageType.GET_TOP_8_UPDATE,
                top8: data_top8Data,
                success: true
            })
        );
    });
}


module.exports = {
    initServerMain:initServerMain
}