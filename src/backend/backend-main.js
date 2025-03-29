const apiRequests = require('./api-requests');
const WebSocket = require('ws');
const { initGameSocket } = require('./game-feed');
const {MessageType} = require ('./message-type-enum');
const {initCaptureServers} = require("./capture-server");
const {data_top8Data} = require("./api_requested_data");
const {initGoogleSheets} = require("./google-sheets-api");

let authToken;
const frontendWss = new WebSocket.Server({ port: 7071 });
const clients = new Map(); // holds all active WS connections
const top8refreshInterval = 1;

// hold onto data here
let isStartGGPollingActive = false;
let isGoogleSheetsAuthed = false;
let isStriveConnected = false;

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
   initGoogleSheets().then(
        ()=>{ console.log("Auth successful!");
          sendGoogleAuthMessage(true);
        }).catch(console.error);
}

function handleWsMessage(rawMessage, ws){
    console.log("message received");
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
    if (msg.type === MessageType.API_CONNECT_REQUEST){
        if (msg.request?.api_service_name === "ALL") {
            // Add in updates for all other requests
            sendGoogleAuthMessage();
        }
        else if (msg.request?.api_service_name === "GOOGLE"){
            sendGoogleAuthMessage();
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

function sendGoogleAuthMessage(){
    console.log("sending google auth reply");
    clients.forEach((ws)=> {
        ws.send(
            JSON.stringify({
                type: MessageType.API_CONNECT_REPLY,
                reply: {api_service_name: "GOOGLE"},
                success: isGoogleSheetsAuthed
            })
        );
    });
    //setInterval(()=>{sendGoogleAuthMessage,2000);
}

module.exports = {
    initServerMain:initServerMain
}