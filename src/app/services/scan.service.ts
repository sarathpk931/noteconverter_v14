import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ScanOptionsService } from '../../app/services/scan-options.service';
import { JobService } from './job.service';
import { AppComponent } from '../../app/app.component';
import { ModalService } from '../../app/services/modal.service';
import { LogService } from './log.service';
import { ErrorHandlerService } from '../../app/services/error-handler.service';
import { ScanTemplateService } from '../../app/services/scan-template.service';
import {xrxTemplatePutTemplate,xrxTemplateDeleteTemplate}  from  '../../assets/Xrx/XRXTemplate';
import { tap } from 'lodash';
import {xrxStringToDom,xrxGetElementValue} from '../../assets/Xrx/XRXXmlHandler';
import {xrxScanV2InitiateScanJobWithTemplate,xrxScanV2ParseInitiateScanJobWithTemplate} from '../../assets/Xrx/XRXScanV2';
import {xrxJobMgmtGetJobDetails,xrxJobMgmtParseGetJobDetails,xrxJobMgmtParseJobStateReasons} from '../../assets/Xrx/XRXJobManagement';
import {xrxParseJobStateReasons} from '../../assets/Xrx/XRX_EIPWSHelpers';


@Injectable({
  providedIn: 'root'
})
export class ScanService {

  
  constructor(
    
    private http: HttpClient,
    private modalService: ModalService,
    private scanOptionsService: ScanOptionsService,
    private scanTemplateService: ScanTemplateService,
    private logService: LogService,
    private jobService: JobService,
    private errorHandlerService: ErrorHandlerService,
    private appComponent:AppComponent,
     
  ) {}

  private printerUrl = 'http://127.0.0.1';
  private sessionUrl = 'http://localhost';

  private startScanTime: Date | null = null;
  private stopScanTime: Date | null = null;
  private timeoutInMinutes = 1;
  
  isScanning: boolean = false;
  isComplete: boolean = false;

  public callbacks = {
    handleScanException: (message: string) => {
      this.callbacks.completeScan({ error: true, message: message });
    },
    handleJobCanceled: () => {
      this.callbacks.completeScan({ error: true, message: 'canceled' });
    },
    handleJobAbortedBySystem: () => {
      this.callbacks.completeScan({ message: 'Scan Job Aborted By System' });
    },
    handleInputSizeNotDetermined: () => {
      this.callbacks.completeScan({ error: true, message: 'Input size not determined' });
    },
    handleJobComplete: () => {
      this.callbacks.completeScan({ message: 'complete' });
    },
    handleFinishPutTemplateError: () => {
      this.callbacks.completeScan({ error: true, message: 'Error sending template to device' });
    },
    handleBeginCheckFailure: (request: any, response: any) => {
      this.callbacks.completeScan({ error: true, deviceDetails: response });
    },
    handlePutTemplateFailure: (message: string) => {
      this.callbacks.completeScan({ error: true, deviceDetails: message });
    },
    completeScan: (detail: any) => {
      this.isScanning = false;
      this.isComplete = true;
      if (detail.error) {
        this.completeScanPromise.reject(detail);
      } else {
        this.completeScanPromise.resolve(detail);
      }
    }
  };

  private template: any;
  private completeScanPromise: any = null;
  private jobid: any = null;

  public isExistingEmail(email: string): Observable<any> {
    const config = {
      headers: {
        'Content-Type': 'text/json; charset=utf-8',
        Authorization: 'ED803572-7B6B-4E56-8DCB-9F9C22C679FA'
      }
    };

    return this.http
      .get(`api/IsExistingEmail?email=${email}`, config)
      .pipe(catchError((error) => throwError(error)));
  }

  /* public scan(model: any): Observable<any> {
    this.logService.logMsg('service.scan', 'information');
    if (this.isScanning) {
      this.logService.logMsg('service.scan -> service.isScanning : Please wait!!!!', 'information');
      throw this.appComponent.Strings['SDE_PLEASE_WAIT_UNTIL'];
    }
    this.jobid = this.appComponent.generateNewJobID();
    this.logService.logMsg(`scanService => scan => jobID: ${this.jobid}`, 'information');
    model.jobid = this.jobid;
    this.template = new this.scanTemplate(model);
    this.modalService.showProgressAlert(this.strings.SDE_SCANNING1);
    return this.http.post('job/register', model).pipe(
      catchError((error) => throwError(error)),
      catchError((error) => {
        this.modalService.closeAll
      }
    }, */

    public scan(model): Promise<void> {
      this.logService.logMsg('service.scan', 'information');
  
      if (this.isScanning) {
        this.logService.logMsg('service.scan -> service.isScanning : Please wait!!!!', 'information');
        throw this.appComponent.Strings['SDE_PLEASE_WAIT_UNTIL'];
      }

      this.jobid = this.jobService.generateNewJobID();
  
      this.logService.logMsg('scanService => scan => jobID:' + this.jobid, 'information');

      model.jobid = this.jobid;
  
      const template = this.scanTemplateService.scanTemplate(model);
  
      this.modalService.showProgressAlert(this.appComponent.Strings['SDE_SCANNING1'],'');
  
      return this.jobService.registerJob(model).then(function(result){ //.toPromise()
        
          const tStr = template.toString();
          this.logService.logMsg('scanService => scan => template:' + tStr, 'information');
          this.isScanning = true;
          this.isComplete = false;
          this.completeScanPromise = new Promise((resolve, reject) => {});
          this.logService.logMsg('service.scan -> calling putTemplate()', 'information');
          this.putTemplate();

        return  this.completeScanPromise;
      });
    };
  
    putTemplate(): Promise<any> {
      return  new Promise((resolve,reject)=>{
      this.logService.logMsg('putTemplate()...', 'information');
      const printerUrl = 'path/to/printerUrl';
      const template = 'exampleTemplate'; // Replace with actual template object
      const templateName=''; //templateName
      const callId = 'exampleCallId'; // Replace with actual call ID
      function successCallback (callId: any, response: any) {
        
        this.logService.logMsg(`scanService => putTemplate => callId:${callId} response:${response}`, 'information');
        this.finishPutTemplate(callId, response,printerUrl,template,3000);
        const result={};
        resolve (result);
      };
      function errorCallback  (result: any)  {
        this.modalService.closeAllModals();
        this.errorHandlerService.APP_UNAVAILABLE_AT_THIS_TIME();
        reject(result);
      };
        xrxTemplatePutTemplate(
          printerUrl,
          template,
          templateName,
          successCallback,
          errorCallback,
          5000
        );
      });
    }
  
   
    finishPutTemplate(callId: any, response: string, printerUrl: string, template: any, timeoutInMinutes: number):Promise<any>{
      return new Promise((resolve,reject)=>{
        this.logService.logMsg(`finishPutTemplate(callId,response) -> callId: ${callId} response: ${response}`, 'information');
        const xmlDoc = xrxStringToDom(response);
        this.logService.logMsg(`finishPutTemplate(callId,response) -> xmlDoc: ${xmlDoc}`, 'information');
        template.checkSum = xrxGetElementValue(xmlDoc, 'TemplateChecksum');
        function successCallback  (envelope: any, response: any)  {
          this.logService.logMsg(`function finish(callId, response) -> callId: ${callId} response: ${response}`, 'information');
          template.jobId = xrxScanV2ParseInitiateScanJobWithTemplate(response);

        // Let everyone know the job has been submitted.
        //$rootScope.$broadcast('scanJobSubmitted', { jobId: template.jobId, template: template });
        // Begin the check loop.
          const startScanTime = new Date();
          const stopScanTime = new Date();
          stopScanTime.setMinutes(stopScanTime.getMinutes() + timeoutInMinutes);
          
          this.beginCheckLoop(template.jobId);
        };
        function errorCallback  (env: any,message :any)  {
          this.logService.logMsg(`function fail(env, message) {  -> env: ${env} message: ${message}`, 'information');

          this.callbacks.handleFinishPutTemplateError();
          // errorHandlerService.CLOUD_APP_GENERAL_ERROR(); to be implemented

        };
        xrxScanV2InitiateScanJobWithTemplate(
        printerUrl,
        template.name,
        false,
        null,
        successCallback,
        errorCallback
        );
      });
  }

  checkScanTimeout(): boolean {
    if (this.startScanTime !== null && this.stopScanTime !== null) {
      return (
        this.stopScanTime.getMinutes() >= this.startScanTime.getMinutes() &&
        this.stopScanTime.getSeconds() > this.startScanTime.getSeconds()
      );
    }
    return false;
  }

  beginCheckLoop(jobid:string): void {
    if (this.isComplete) { return; }
    this.logService.logMsg('beginCheckLoop()...', 'information');
    xrxJobMgmtGetJobDetails(
      this.sessionUrl,
      'WorkflowScanning',
      this.jobid,
      this.checkLoop,
      this.callbacks.handleBeginCheckFailure.toString(),
      5000
    );
  }

  checkLoop(request: any, response: any) {
    this.logService.logMsg('checkLoop(request, response) -> request:' + request + ' response:' + response, 'information');
    // Any job state?
  let jobStateReason = '';
  const info = xrxJobMgmtParseGetJobDetails(response);
  const jobState = xrxGetElementValue(info, 'JobState');
  const dummy = xrxJobMgmtParseJobStateReasons(response);

  this.logService.logMsg('checkLoop(request, response) -> jobState:' + jobState + ' dummy:' + dummy, 'information');
  console.log(jobState + ' ' + dummy);

  if (jobState === null || jobState === 'Completed') {
    this.logService.logMsg('if (jobState === null || jobState === Completed)', 'information');

    jobStateReason = xrxParseJobStateReasons(response);

    this.logService.logMsg('jobStateReason:' + jobStateReason, 'information');
  }


  //this method is to be implemented for root scope
  /* $rootScope.$broadcast('jobStatusCheckSuccess', { 
    jobId: this.template.jobId,
    state: jobState,
    reason: jobStateReason
  }); */

  // Update the status of the template.
  this.template.status = {
    lastJobState: jobState,
    lastJobStateReason: jobStateReason
  };

  // Checking if the job should be flagged as timeout
  if (this.checkScanTimeout()) {
    this.logService.logMsg('if (checkScanTimeout()) { ', 'information');
    this.template.jobState = 'Completed';
    jobStateReason = 'JobAborted';
    this.callbacks.handleJobAbortedBySystem();
    //$timeout(deleteScanTemplate(), 500);
    this.errorHandlerService.DEVICE_EIP_INTERNAL_ERROR_TIMEOUT();
    return;
  }

  if (jobState === 'Completed' && jobStateReason === 'JobCompletedSuccessfully') {
    this.modalService.closeAllModals();

    const title = 'SDE_DOCUMENT_SUCCESSFULLY_SCANNED'; //strings to be replaced from app resources in Web Solution file
    const msg = 'SDE_WILL_RECEIVE_EMAIL2'.replace('{0}', 'Xerox Note Converter');
    //this.modalService.showSimpleAlert(title, msg);

    this.logService.logMsg('if (jobState === Completed && jobStateReason == JobCompletedSuccessfully) { ', 'information');
    //$rootScope.$broadcast('jobProgress', 'JOB_COMPLETED_SUCCESSFULLY'); to be implemented
  }

  if (jobState === 'Completed' && jobStateReason === 'InputScanSizeNotDetermined') {
    this.logService.logMsg('if (jobState === Completed && jobStateReason === InputScanSizeNotDetermined) {  jobState:' + jobState + ' jobStateReason:' + jobStateReason, 'information');
    this.errorHandlerService.INPUT_SCAN_SIZE_NOT_DETERMINED();
    this.callbacks.handleInputSizeNotDetermined();
    //$timeout(deleteScanTemplate(), 500);  to be implemented
    return;
  }

  if (jobState === 'Completed' && jobStateReason === 'None') {
    // do nothing
  } else if (jobState === 'Completed' && jobStateReason && jobStateReason != 'JobCompletedSuccessfully') {
    this.logService.logMsg('if (jobState === Completed && jobStateReason && jobStateReason != JobCompletedSuccessfully) {', 'information');
    // $rootScope.$broadcast('jobProgress', jobStateReason);
    this.modalService.closeAllModals();
    this.errorHandlerService.APP_UNAVAILABLE_AT_THIS_TIME();
    return;
  } else {
    this.logService.logMsg('jobProgress:' + jobState, 'information');
    // $rootScope.$broadcast('jobProgress', jobState);
  }

  if (jobState === 'Completed' && jobStateReason == 'JobCompletedSuccessfully') {
    //$timeout(this.callbacks.handleJobComplete(), 500);
    //$timeout(deleteScanTemplate(), 500);
    return;
    }

    else if (jobState === 'Completed' && (jobStateReason === 'JobAborted' || jobStateReason === 'AbortBySystem')) {
      this.logService.logMsg('else if (jobState === Completed && (jobStateReason === JobAborted || jobStateReason === AbortBySystem)) {', 'information');
      this.errorHandlerService.SDE_JOB_CANCELED1();
      this.callbacks.handleJobAbortedBySystem();
      //$timeout(deleteScanTemplate(), 500);
    }
    
    else if (jobState === 'Completed' && (jobStateReason === 'JobCanceledByUser' || jobStateReason === 'CancelByUser')) {
      this.logService.logMsg('else if (jobState === Completed && (jobStateReason === JobCanceledByUser || jobStateReason === CancelByUser)) {', 'information');
      this.errorHandlerService.SDE_JOB_CANCELED1();
      this.callbacks.handleJobCanceled();
      //$timeout(deleteScanTemplate(), 500); this.
    }

    else if (jobState === 'ProcessingStopped' && (jobStateReason === 'NextOriginalWait' || jobStateReason === '')) {
      this.logService.logMsg('else if ProcessingStopped NextOriginalWait', 'information');
      //$timeout(beginCheckLoop, 2000);
    }
    else if (!(jobState === 'Completed' && jobStateReason === "None") && (jobState === 'Completed' || jobState === 'ProcessingStopped')) {
      this.logService.logMsg('else if Completed ProcessingStopped', 'information');
      //$timeout(service.callbacks.handleJobComplete(), 500);
      //$timeout(deleteScanTemplate(), 500);
    }
    else if (jobState === null && jobStateReason === 'JobCanceledByUser') {
      this.logService.logMsg('else if JobCanceledBUser', 'information');
      //$rootScope.$broadcast('jobProgress', jobStateReason);
      this.callbacks.handleJobCanceled();
      //$timeout(deleteScanTemplate(), 500);
      this.errorHandlerService.SDE_JOB_CANCELED1();
    }
    else if (jobState === null && jobStateReason !== '') {
      this.logService.logMsg('else if (jobState === null && jobStateReason !== ) {  jobStateReason:' + jobStateReason, 'information');
      this.errorHandlerService.SDE_JOB_CANCELED1();
      this.callbacks.handleScanException(jobStateReason);
      //$timeout(deleteScanTemplate(), 500);
    }
    else {
      //$timeout(beginCheckLoop, 2000);
    }
  }

  deleteScanTemplate():void {
    // We can delete the template by checksum if we have it.
    if (this.template.checkSum) {

      
      xrxTemplateDeleteTemplate(this.printerUrl, this.template.name, this.template.checkSum, 
         this.success,
         this.failure
        );
    }
  }

  success(message:any){}

  failure(message:any){}
}

