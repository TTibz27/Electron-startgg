import {Component, OnInit} from '@angular/core';
import {BackendSocketServiceService} from "../../services/backend-socket-service.service";
import {filter} from "rxjs";
import {MessageTypeEnum} from "../../message-type-enum";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-connect-to-google-sheets',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './connect-to-google-sheets.component.html',
  styleUrl: './connect-to-google-sheets.component.css'
})
export class ConnectToGoogleSheetsComponent implements OnInit{

  public isGoogleAuthed : boolean;
  public lastUpdateDuration: number;
  private lastReceivedTime: number;

  constructor(private socketService: BackendSocketServiceService){
    this.lastUpdateDuration = 0;
    this.lastReceivedTime = Date.now();
    this.isGoogleAuthed = false;
  }

  ngOnInit() {
    this.socketService.BackendWS.pipe(filter(msg => msg.type === MessageTypeEnum.API_CONNECT_REPLY)).subscribe((msg) => {
      console.log(" ---async hit ---");
      console.log(msg);
      if (msg.reply?.api_service_name === "GOOGLE"){
        this.isGoogleAuthed = msg.success;
        const now = Date.now();
        this.lastUpdateDuration = (now - this.lastReceivedTime) / 1000;
        this.lastReceivedTime = now;
      }
    });
  }
}
