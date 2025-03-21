
const backendSocket = new WebSocket('ws://localhost:7071');



backendSocket.onopen = () => {
    console.log('Backend connected');
    backendSocket.send(JSON.stringify({
        requestType:"ConnectedConfirmation",
    }));
};
backendSocket.onmessage = (rawMsg) => {
    const msg = JSON.parse(rawMsg.data)
     //console.log(msg);
    handleMessage(msg)
}

function handleMessage(msg){
  if (msg.type === 7 ){ //GET_TOP_8_UPDATE: 7
    console.log(msg.top8);
    let data =msg.top8;
      for (const round in data) {
          if (Object.prototype.hasOwnProperty.call(data, round)) {
              const roundData = data[round];
                setInnerHtml(roundData);
                console.log("html set");
          }
      }
  }

  function setInnerHtml(data) {
      console.log(data);
      if (data.set_id === undefined){
          return
      }
    const p1SetSpanId = "Set"+data.set_id+"_P1";
    const p2SetSpanId = "Set"+data.set_id+"_P2";
    const p1NameSpanId = "Set"+data.set_id+"_P1Name";
    const p1ScoreSpanId = "Set"+data.set_id+"_P1Score";
    const p2NameSpanId = "Set"+data.set_id+"_P2Name";
    const p2ScoreSpanId = "Set"+data.set_id+"_P2Score";

    if (data.set_id === "E" && data.player1_name !== "" && data.player2_name !== "" ){
        document.getElementById("GrandFinalsReset").classList.remove('HideGFR');
    }
    console.log
    const player1name = data.player1_name;
    const player2name = data.player2_name;
    console.log(data.player1_score);
      console.log( typeof data.player1_score === 'number');
    const p1Score =  typeof data.player1_score !== 'number'? "" : data.player1_score;
    const ps2Score=  typeof data.player2_score !== 'number'? "" : data.player2_score;


    document.getElementById(p1NameSpanId).innerHTML = player1name + "";
    document.getElementById(p1ScoreSpanId).innerHTML = p1Score + "";
    document.getElementById(p2NameSpanId).innerHTML =  player2name + "";
    document.getElementById(p2ScoreSpanId).innerHTML =ps2Score + "";

    if(data.player1_score === 3 || data.player2_score === 3){
        if (data.player1_score > data.player2_score){
            const element = document.getElementById(p2SetSpanId); // Select the element
            element.classList.add('lossIndication'); // Add the class 'new-class'
        }
        else if (data.player2_score > data.player1_score){
            const element = document.getElementById(p1SetSpanId); // Select the element
            element.classList.add('lossIndication'); // Add the class 'new-class'
        }
    }
  }
}