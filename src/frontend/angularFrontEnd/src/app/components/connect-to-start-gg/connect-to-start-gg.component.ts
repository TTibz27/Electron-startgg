import {Component, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BackendSocketServiceService} from "../../services/backend-socket-service.service";
import {filter, take} from "rxjs";
import {MessageTypeEnum} from "../../message-type-enum";
import {NgClass, NgIf} from "@angular/common";
import {CdkCopyToClipboard} from "@angular/cdk/clipboard";
import {MatSnackBar} from "@angular/material/snack-bar";


@Component({
  selector: 'app-connect-to-start-gg',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NgIf,
    NgClass,
    CdkCopyToClipboard
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

  constructor(private socketService: BackendSocketServiceService,
              private snackbar: MatSnackBar){
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
    this.socketService.BackendWS.pipe(filter( msg => msg.type === MessageTypeEnum.GET_TOP_8_REPLY), take(1)).subscribe((data)=>{
      console.log("reply hit");
      console.log(data);
      if (data.success){
        this.isApiRequestRunning = true;
      }
      else {
        this.snackbar.open("Error: " + data.reply, "Dismiss");
      }

    });
    this.socketService.sendTop8Request(this.startggURL);
  }

  public async copyTop8Link (){
    // Get the text field
    const textSource = document.getElementById('Top8UrlInput');
    if (textSource) {
      let copyText = textSource.textContent ?  textSource.textContent : '';


    console.log("Copying text: " + copyText);

    const clipboardItemData = {
      "text/plain": "http://localhost:2369/top8/",
    };
    await navigator.clipboard.write([new ClipboardItem(clipboardItemData)]);
    }
  }
}
