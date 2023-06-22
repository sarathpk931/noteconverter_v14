import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import {throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import { ApiService } from './api.service';
import { ConfigurationService } from './configuration.service';
import { LogService } from './log.service';
import {environment} from '../../environments/environment';
import {AppModule} from '../../app/app.module';

@Injectable({
  providedIn: 'root'
})



export class JobService {

  env = environment;


  constructor(private http: HttpClient, private apiService: ApiService,
    private configurationService: ConfigurationService, private logService: LogService) { }

    registerJob(featureValues: any) {

      try{

      const config = { headers: new HttpHeaders({ "Content-Type": "text/json; charset=utf-8" }) };
  
      const parsedFilename = featureValues.fileName + '.pdf';
  
      var  LocalizedLanguage:'en-US'; //to be defined and injected based on browser language ,assigned default 'en'for local testing

      const job = {
        jobId: featureValues.jobid,
        emailAddress: featureValues.email,
        timeZoneOffsetMinutes: new Date().getTimezoneOffset(),
        filename: parsedFilename,
        localizedLanguage: LocalizedLanguage, // Need to define this variable
        appId: this.env.appId, //this.configurationService.getSetting('appId'),
        deviceId: AppModule.deviceId,//this.configurationService.getSetting('deviceId'),
        orientation: featureValues.orientation,
        format: featureValues.fileFormat.toUpperCase(),
        archivalFormat:''
      };
      this.logService.trackTrace('Device Id:' + job.deviceId.toString());
      
      if (featureValues.fileFormat === "pdf") {
        job.archivalFormat = (featureValues.archivalFormat ? 'PDF/A-1b' : 'PDF');
      }
  
      const request = {
        job: job
      };
 //this.apiService.apiUrl
      return this.http.post(this.env.wncAddress+("/api/v1/job"), request, config).toPromise()
        .then((result: any) => {
          this.logService.trackTrace('jobService -> registerJob -> success -> result.data:' + result);
          return result;//.data
        })
        .catch((error: any) => {
          this.logService.trackTrace('jobService -> registerJob -> ERROR...');
          if (error != null && error.data != null && error.data.ExceptionMessage != null) {
            this.logService.trackTrace('jobService -> registerJob -> ERROR:' + error.data.ExceptionMessage);
          }
  
          if (error && error.status == 401) {
            // Need to define $rootScope and $broadcast
           // $rootScope.$broadcast("globalAppMessage", "unauthorized");
          }
        });
      }
      catch(ExceptionMessage)

      {
        this.logService.trackException(ExceptionMessage);
        return  null;
      }

    
    }

    generateNewJobID():string {
      const guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
      });
      return guid;
    }
}
