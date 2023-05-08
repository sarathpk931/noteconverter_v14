import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ConfigurationService } from './configuration.service';
import { LogService } from './log.service';
import { AppComponent } from '../../app/app.component';


@Injectable({
  providedIn: 'root'
})
export class JobService {

  constructor(
    private http: HttpClient,
    private apiService: ApiService,
    private configurationService: ConfigurationService,
    private logService: LogService,
    private appcomponent : AppComponent
    ) { }

    

    registerJob(featureValues: any):Observable<any> {

      const config = { headers: new HttpHeaders({ "Content-Type": "text/json; charset=utf-8" }) };
  
      const parsedFilename = featureValues.fileName + '.pdf';
  
      const job = {
        jobId: featureValues.jobid,
        emailAddress: featureValues.email,
        timeZoneOffsetMinutes: new Date().getTimezoneOffset(),
        filename: parsedFilename,
        localizedLanguage: this.appcomponent.Strings,   //get localizedLanguage from appcomponent strings method respnse, // Need to define this variable
        appId: this.configurationService.getSetting('appId'),
        deviceId: this.configurationService.getSetting('deviceId'),
        orientation: featureValues.orientation,
        format: featureValues.fileFormat.toUpperCase(),
        archivalFormat:''
      };
  
      if (featureValues.fileFormat === "pdf") {
        job.archivalFormat = (featureValues.archivalFormat ? 'PDF/A-1b' : 'PDF');
      }
  
      const request = {
        job: job
      };
  
      return this.http.post(this.apiService.apiUrl("/api/v1/job"), request, config).pipe(
        tap((result) => {
          this.logService.logMsg('jobService -> registerJob -> success -> result.data:' + result.toString(), 'information');
        }),
        catchError((error) => {
          this.logService.logMsg('jobService -> registerJob -> ERROR...', 'error');
  
          if (error != null && error.data != null && error.data.ExceptionMessage != null) {
            this.logService.logMsg('jobService -> registerJob -> ERROR:' + error.data.ExceptionMessage, 'error');
          }
  
          if (error && error.status == 401) {
            // Need to define $rootScope and $broadcast to broadcast this error
            //$rootScope.$broadcast("globalAppMessage", "unauthorized");
          }
          return of([]);
        })
      );
    }

    generateNewJobID() {
      const guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
      });
    }
}
