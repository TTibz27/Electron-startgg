console.log("Renderer logging");



//console.log(elements.join('/'));


const func = async () => {
    const response = await window.versions.ping()
    console.log(response) // prints out 'pong'
  }

  func()

const socket = new WebSocket('ws://localhost:7071');

// Event handlers
socket.onopen = () => {
  console.log('WebSocket connected');
  socket.send(JSON.stringify({
    requestType:"ConnectedConfirmation",
  })); 
};

window.onload = viewInit();

function viewInit(){
  var el = document.getElementById("pullTop8Button");
  if (el.addEventListener)
      el.addEventListener("click", getDataFromServer, false);
  else if (el.attachEvent)
      el.attachEvent('onclick', getDataFromServer);
  
}

function getDataFromServer(){


  const url = document.getElementById("UserEnteredURL").value;// "https://www.start.gg/tournament/frosty-faustings-xiv-2022/event/guilty-gear-strive/overview";

  if(!url){
    console.log("No URL, not sending");
    return;
  }
  else{
    console.log("Entered URL - " + url );
  }
  console.log("Sending message from UI....")
  socket.send(JSON.stringify({
    requestType:"getTop8Data",
    slug: getSlugFromURL(url)
  }));
  console.log("sent");
}



function getSlugFromURL(fullURL){
  console.log("CHONKIN");
  const urlChunks = fullURL.split("/");
  startIndex = -1;
  endIndex  =-1;  // technically not an index I dont think but w.e.
  for (let i = 0; i < urlChunks.length; i++) {
    console.log("index - " + i + " | val - "+ urlChunks[i]);
      if(urlChunks[i] == "tournament") {
        startIndex = i;
      }
      if (urlChunks[i] == "event") {
        endIndex = i + 2; // this goes up by to to grab event name and this chunk 
      }
  }
  if (startIndex != -1 && endIndex != -1){
      const slugArr =  urlChunks.slice(startIndex, endIndex);
      console.log("Slug");
      console.log(slugArr.join('/'));
      return slugArr.join('/');
  }
  else {
    console.log("Invalid web address entered!");
    return null;
  }
}