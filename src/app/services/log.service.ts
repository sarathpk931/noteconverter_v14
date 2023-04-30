import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StorageService } from '../services/storage.service';


@Injectable({
  providedIn: 'root'
})
export class LogService {

  private storageProvider: Storage;



  constructor(
    private http: HttpClient,
    private storageService: StorageService
    ) {
    this.storageProvider = this.storageService.getLocalStorage(true);
    
  }

  public logMsg(message: string, logType?: string): void {

    const config = {
      headers: new HttpHeaders({
        'Content-Type': 'text/json; charset=utf-8',
        'Authorization': 'ED803572-7B6B-4E56-8DCB-9F9C22C679FA'
      })
    };

    const deviceID = this.storageProvider.getItem('deviceId');

    const argParms = {
      LogMessage: message,
      LogType: logType || LogTypes.Information,
      DeviceID: deviceID
    };

    this.http.post('api/log', argParms, config).subscribe();
  }

  
}

export const LogTypes = {
  Information: 'information',
  Error: 'error',
  Warning: 'warning'
};

