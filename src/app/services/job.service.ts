import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from './api.service';
import { ConfigurationService } from './configuration.service';
import { LogService } from './log.service';

@Injectable({
  providedIn: 'root'
})



export class JobService {

  constructor(private http: HttpClient, private apiService: ApiService,
    private configurationService: ConfigurationService, private logService: LogService) { }

    registerJob(featureValues: any) {

      const config = { headers: new HttpHeaders({ "Content-Type": "text/json; charset=utf-8" }) };
  
      const parsedFilename = featureValues.fileName + '.pdf';
  
      var  LocalizedLanguage:'en'; //to be defined and injected based on browser language ,assigned default 'en'for local testing

      const job = {
        jobId: featureValues.jobid,
        emailAddress: featureValues.email,
        timeZoneOffsetMinutes: new Date().getTimezoneOffset(),
        filename: parsedFilename,
        localizedLanguage: LocalizedLanguage, // Need to define this variable
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
  
      return this.http.post(this.apiService.apiUrl("/api/v1/job"), request, config).toPromise()
        .then((result: any) => {
          this.logService.logMsg('jobService -> registerJob -> success -> result.data:' + result.data, 'information');
          return result.data;
        })
        .catch((error: any) => {
          this.logService.logMsg('jobService -> registerJob -> ERROR...', 'error');
  
          if (error != null && error.data != null && error.data.ExceptionMessage != null) {
            this.logService.logMsg('jobService -> registerJob -> ERROR:' + error.data.ExceptionMessage, 'error');
          }
  
          if (error && error.status == 401) {
            // Need to define $rootScope and $broadcast
           // $rootScope.$broadcast("globalAppMessage", "unauthorized");
          }
        });
    }
}
