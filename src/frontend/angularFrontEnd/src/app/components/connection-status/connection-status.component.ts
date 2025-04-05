import { Component } from '@angular/core';
import {SettingsService} from "../../services/settings.service";

@Component({
  selector: 'app-connection-status',
  standalone: true,
  imports: [],
  templateUrl: './connection-status.component.html',
  styleUrl: './connection-status.component.css'
})
export class ConnectionStatusComponent {
  public build_version: string;
  constructor(private settings : SettingsService) {
    this.build_version = "";
    this.settings.settingsSubject.subscribe((latest)=>{
      this.build_version =  latest.buildDate + "-" + latest.env; // /environments/env.json
    })
  }
}
