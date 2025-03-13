const { closeSync } = require('original-fs');
const WebSocket = require('ws');

const retryInterval = 1000;

//checking previous states
const prevP1State = {
    action: "test",
    burst: null,
    charaName: null,
    health: null,
    tension: null,
};
const prevP2State = {
    action: null,
    burst: null,
    charaName: null,
    health: null,
    tension: null,
};

function initGameSocket(){
    console.log("init game socket called");
    const gameSocket = new WebSocket('ws://localhost:6615');
    gameSocket.onopen = () => {
      console.log('Game Feed connected');
      gameSocket.send(JSON.stringify({
        requestType:"ConnectedConfirmation",
      })); 
    };
    
    gameSocket.onmessage =(msg)=>{
     handleGameData(msg); 
    }

    gameSocket.onerror = (msg) => {
        console.log("unable to connect to game socket, retrying in " + retryInterval +"ms");
        setTimeout(initGameSocket, retryInterval);
    }
}

function handleGameData(msg){
  
    let data = JSON.parse(msg.data);
   // console.log(data.event)
    switch (data.event){
        case 'ggst_Timeout':
            return;
        case 'ggst_stateUpdate':
            handleStriveStateUpdate(data.eventInfo);
    }

    
}

function handleStriveStateUpdate(eventInfo) {
  //  console.log ("        ------------       HANDLE EVENT UPDATE         ----------         ")
    const p1Action = eventInfo.p1.action;
    const p2Action = eventInfo.p2.action;
    if(p1Action && p2Action){
        if (prevP1State.action != eventInfo.p1.action){
            console.log("P1 New Action:  " + p1Action);
        }

        if (prevP2State.action != eventInfo.p2.action){
            console.log("P2 New Action:  " + p2Action);
        }
    }

       
    prevP1State.action = eventInfo.p1.action;
    prevP1State.burst = eventInfo.p1.burst;
    prevP1State.charaName = eventInfo.p1.charaName;
    prevP1State.health = eventInfo.p1.health;
    prevP1State.tension = eventInfo.p1.tension;
    
    prevP2State.action = eventInfo.p2.action;
    prevP2State.burst = eventInfo.p2.burst;
    prevP2State.charaName = eventInfo.p2.charaName;
    prevP2State.health = eventInfo.p2.health;
    prevP2State.tension = eventInfo.p2.tension;

}


module.exports = {
 initGameSocket:initGameSocket
}