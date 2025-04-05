import { Injectable } from '@angular/core';
import {BackendSocketServiceService} from "./backend-socket-service.service";
import {filter, Observable, ReplaySubject, Subject} from "rxjs";
import {MessageTypeEnum} from "../message-type-enum";

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  public settingsSubject : ReplaySubject<any>;

  constructor() {
    this.settingsSubject = new ReplaySubject(1);

  }
}
