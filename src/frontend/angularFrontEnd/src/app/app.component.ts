import {Component, HostListener, inject} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {BackendSocketServiceService} from './services/backend-socket-service.service';
import {FormsModule} from "@angular/forms";
import {ConnectToStartGGComponent} from "./components/connect-to-start-gg/connect-to-start-gg.component";
import {ConnectToGoogleSheetsComponent} from "./components/connect-to-google-sheets/connect-to-google-sheets.component";
import {ConnectToOBSComponent} from "./components/connect-to-obs/connect-to-obs.component";
import {ConnectToSammiModComponent} from "./components/connect-to-sammi-mod/connect-to-sammi-mod.component";
import {ConnectionStatusComponent} from "./components/connection-status/connection-status.component";



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, ConnectToStartGGComponent, ConnectToGoogleSheetsComponent, ConnectToOBSComponent, ConnectToSammiModComponent, ConnectionStatusComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Jeekly Mission Control';
  @HostListener('mousedown')
  onClick() {
    const mouseEvent: MouseEvent = event as MouseEvent;
    if (mouseEvent.button !== 2) return;
    console.log(mouseEvent);


  }
  constructor(  ) {
    // renderer
  }
}
