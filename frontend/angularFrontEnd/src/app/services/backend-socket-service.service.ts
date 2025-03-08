import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BackendSocketServiceService {

  public backendSocket: WebSocket;

  constructor() {
   this.backendSocket = new WebSocket('ws://localhost:7071');
      
    this.backendSocket.onopen = () => {
      console.log('Backend connected');
      this.backendSocket.send(JSON.stringify({
        requestType:"ConnectedConfirmation",
      })); 
    };
   }


   public test(){

    console.log("test");
   }
   
  public sendTop8Request(url : string){

   // const url = document.getElementById("UserEnteredURL").value;// "https://www.start.gg/tournament/frosty-faustings-xiv-2022/event/guilty-gear-strive/overview";

    if(!url){
      console.log("No URL, not sending");
      return;
    }
    else{
      console.log("Entered URL - " + url );
    }
    console.log("Sending message from UI....")
    this.backendSocket.send(JSON.stringify({
      requestType:"getTop8Data",
      slug: this.getSlugFromURL(url)
    }));
    console.log("sent");
  }

  private getSlugFromURL(fullURL: string) :string|null{
    console.log("CHONKIN");
    const urlChunks = fullURL.split("/");
    let startIndex = -1;
    let endIndex  =-1;  // technically not an index I dont think but w.e.
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
}
