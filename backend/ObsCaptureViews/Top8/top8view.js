
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



    document.getElementById(p1NameSpanId).innerHTML = data.player1_name + "";
    document.getElementById(p1ScoreSpanId).innerHTML = data.player1_score + "";
    document.getElementById(p2NameSpanId).innerHTML = data.player2_name + "";
    document.getElementById(p2ScoreSpanId).innerHTML = data.player2_score + "";


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