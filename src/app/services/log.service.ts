import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StorageService } from '../services/storage.service';
import {environment} from '../../environments/environment';
import { AngularPlugin } from '@microsoft/applicationinsights-angularplugin-js';
import { ApplicationInsights, Exception } from '@microsoft/applicationinsights-web';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  private storageProvider: Storage;
  env = environment;
  private angularPlugin = new AngularPlugin();


  private appInsights = new ApplicationInsights({
    config: {
        instrumentationKey: this.env.instrumentationKey,
        enableAutoRouteTracking: true
    },
}); 

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    private router: Router
    ) {
    this.storageProvider = this.storageService.getLocalStorage(true);
    this.appInsights.loadAppInsights();
     
    //const angularPlugin = new AngularPlugin();
    //this.appInsights.addTelemetryInitializer(angularPlugin);
    this.appInsights.trackPageView();
  }

// expose methods that can be used in components and services
trackEvent(name: string): void {
  this.appInsights.trackEvent({ name });
}

trackTrace(message: string): void {
  this.appInsights.trackTrace({ message });
}

trackException(exception : Exception){
  this.appInsights.trackException(exception);
} 

public logMsg(message: string, logType?: string): void {

  const config = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': 'ED803572-7B6B-4E56-8DCB-9F9C22C679FA'
    })
  };

    const deviceID = this.storageProvider.getItem('deviceId');

    const argParms = {
      LogMessage: message,
      LogType: logType || LogTypes.Information,
      DeviceID: deviceID
    };

    this.http.post(this.env.deviceUrl+':5155/api/log', argParms, config).subscribe();
  }
  
}

export const LogTypes = {
  Information: 'information',
  Error: 'error',
  Warning: 'warning'
};

