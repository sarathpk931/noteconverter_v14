import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StorageService } from '../services/storage.service';


@Injectable({
  providedIn: 'root'
})
export class LogService {

  private storageProvider: Storage;
  //private readonly filename = 'app-errors.log';


  constructor(
    private http: HttpClient,
    private storageService: StorageService
    ) {
    this.storageProvider = this.storageService.getLocalStorage(true);
    
  }

  public logMsg(message: string, logType?: string): void {
debugger;
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

    this.http.post('http://localhost:5155/api/log', argParms, config).subscribe();
  }

  // log(error: Error): void {
  //   const logEntry = new Date().toISOString() + ': ' + error.message + '\n';

  //   const file = new Blob([logEntry], { type: 'text/plain' });
  //   const a = document.createElement('a');
  //   const url = URL.createObjectURL(file);
  //   a.href = url;
  //   a.download = this.filename;
  //   a.click();
  //   URL.revokeObjectURL(url);
  // }
}

export const LogTypes = {
  Information: 'information',
  Error: 'error',
  Warning: 'warning'
};

