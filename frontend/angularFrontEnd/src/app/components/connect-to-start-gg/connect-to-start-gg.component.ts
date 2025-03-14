import {Component, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BackendSocketServiceService} from "../../services/backend-socket-service.service";
import {filter, take} from "rxjs";
import {MessageTypeEnum} from "../../message-type-enum";
import {NgClass, NgIf} from "@angular/common";


@Component({
  selector: 'app-connect-to-start-gg',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NgIf,
    NgClass
  ],
  templateUrl: './connect-to-start-gg.component.html',
  styleUrl: './connect-to-start-gg.component.css'
})
export class ConnectToStartGGComponent implements OnInit{
  public startggURL : string;
  public isApiRequestRunning : boolean;
  public lastUpdateDuration: number;
  private lastRecievedTime: number;
  public readonly top8URL = " http://localhost:2369/top8/";
  constructor(private socketService: BackendSocketServiceService){
    this.startggURL = "";
    this.isApiRequestRunning = false;
    this.lastUpdateDuration = 0;
    this.lastRecievedTime = Date.now();
  }

  ngOnInit(){
    this.socketService.BackendWS.pipe(filter( msg => msg.type === MessageTypeEnum.GET_TOP_8_UPDATE)).subscribe((msg)=>{
      console.log(" ---async hit ---");
      console.log(msg);
      this.isApiRequestRunning = true;
      const now = Date.now();

      this.lastUpdateDuration = (now - this.lastRecievedTime) / 1000;

      this.lastRecievedTime = now;

    });

  }

  public submitURL(){
    console.log("Testing");
    console.log(this.startggURL);
    this.socketService.BackendWS.pipe(filter( msg => msg.type === MessageTypeEnum.GET_TOP_8_REPLY), take(1)).subscribe(()=>{
      console.log("reply hit");
      this.isApiRequestRunning = true;
    });
    this.socketService.sendTop8Request(this.startggURL);
  }

  public copyTop8 (){
    // Get the text field
    let copyText = document.getElementById("Top8UrlSpan");
    if (copyText === null){
      return;
    }

    // // Select the text field
    // copyText.select();
    // copyText.setSelectionRange(0, 99999); // For mobile devices
    //
    // // Copy the text inside the text field
    // navigator.clipboard.writeText(copyText.value);
    //
    // // Alert the copied text
    // alert("Copied the text: " + copyText.value);
  }
}
