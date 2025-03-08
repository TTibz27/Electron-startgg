import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {BackendSocketServiceService} from './services/backend-socket-service.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angularFrontEnd';
  socketService = inject(BackendSocketServiceService);
  
}
