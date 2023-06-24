import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule,ErrorHandler } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {Router} from '@angular/router';
import { ApplicationinsightsAngularpluginErrorService } from '@microsoft/applicationinsights-angularplugin-js';

import { MatDialogModule,MatDialogRef } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';

import {LogService} from '../app/services/log.service';
import {StorageService} from '../app/services/storage.service';
import {ScanOptionsService} from '../app/services/scan-options.service';
import {ErrorHandlerService} from '../app/services/error-handler.service';
import {JobService} from '../app//services/job.service';
import {ApiService} from '../app/services/api.service';
import {ConfigurationService} from '../app/services/configuration.service';


import { PrivacyPolicyComponent } from './views/privacy-policy/privacy-policy.component';
import { ProgressAlertComponent } from './views/progress-alert/progress-alert.component';
import { FeaturePopoverComponent } from './views/feature-popover/feature-popover.component';

import { AlertBannerComponent } from './views/alert-banner/alert-banner.component';
import { BasicAlertComponent } from './views/basic-alert/basic-alert.component';

import { GeneralAlertComponent } from './views/general-alert/general-alert.component';
import {LogViewComponent} from '../app/views/log-view/log-view.component';
import {XasStringDirective} from '../app/Directives/xas-string.directive';

//pipes
import { TranslatePipe } from './filters/translate.pipe';
import { ModalService } from './services/modal.service';
import { ScanScreenComponent } from './views/scan-screen/scan-screen.component';
import {ScanService} from './services/scan.service';
import {ScanTemplateService} from './services/scan-template.service';
import {ResourcestringService } from './services/resourcestring.service';

import { xrxDeviceConfigGetDeviceInformation } from '../assets/Xrx/XRXDeviceConfig';
import {xrxStringToDom} from '../assets/Xrx/XRXXmlHandler';
import {xrxSessionGetSessionInfo,xrxSessionParseGetSessionInfo}  from  '../assets/Xrx/XRXSession';//xrxSessionGetSessionInfoRequest,
import {xrxGetElementValue} from '../assets/Xrx/XRXXmlHandler';
// import {xrxCallWebservice,xrxCallAjax} from '../assets/Xrx/XRXWebservices';
import * as _ from 'lodash';
import { EditableFieldDirective } from './Directives/editable-file-name.directive';
import { NgScrollableDirective } from './Directives/ng-scrollable.directive';
import { ActionBarDirective } from './Directives/action-bar.directive';
import { EditableFieldComponent } from './views/editable-field/editable-field.component';


import { ScrollingModule } from '@angular/cdk/scrolling';
import { TextFieldDirective } from './Directives/text-field.directive';

@NgModule({
  declarations: [
    AppComponent,
    LogViewComponent,
    PrivacyPolicyComponent,
    ProgressAlertComponent,
    ScanScreenComponent,
    FeaturePopoverComponent,
    XasStringDirective,
    GeneralAlertComponent,
    EditableFieldDirective,
    BasicAlertComponent,
    AlertBannerComponent,
    NgScrollableDirective,
    ActionBarDirective,
    EditableFieldComponent,
    TextFieldDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    ScrollingModule 
  ],
  providers: [
     {
    provide :APP_INITIALIZER,
    useFactory:()=>  Device,
    multi:true,
  }, 
  {
    provide :APP_INITIALIZER,
    useFactory:()=> Session,
    multi:true,
  }, /**/
  {
  provide: ErrorHandler,
  useClass: ApplicationinsightsAngularpluginErrorService,
  },  
    StorageService,
    LogService,
    ModalService,
    ScanOptionsService,
    AppComponent,
    ErrorHandlerService,
    JobService,
    ApiService,
    ConfigurationService,
    ScanService,
    ScanTemplateService,
    ResourcestringService,
    TranslatePipe,
  ],
  
  bootstrap: [AppComponent]
})
export class AppModule {
  public static Generation:any;
  public static model : string;
  public static deviceId:string;
  public static isThirdGenBrowser : boolean;
  public static isVersalink : boolean;
  public static isAltalink : boolean;
  public static email : string;
 }

export async function Session(url: string,timeout:number,async:boolean, ldap: string): Promise<any> {
  return new Promise((resolve, reject) => {
    function successCallbackSession (envelope: string, response: string) {
      var data =xrxSessionParseGetSessionInfo(response);
      //console.log(data);
      
      // const parser = new DOMParser();
      // const xmlDoc = parser.parseFromString(data.firstChild, 'text/xml');
      
      var userEmail = "";
      if (data.firstChild !== null) {
        var userName = xrxGetElementValue(data.firstChild, "username");
        //alert('username :'+ userName);
        //const userName = data.firstChild.getElementsByTagName('qualifiedUsername')[0].firstChild.textContent;//alert("Username :"+ userName);
        if (userName !== null && userName.toLowerCase() !== 'guest')
          userEmail = xrxGetElementValue(data.firstChild, "from");//alert('email :'+ userEmail);
        const result ={
          
          email:userEmail
        };
        AppModule.email = result.email.toString();//alert("AppModuule :"+ AppModule.email);
        //alert('success :'+ result.email.toString());
        resolve(result.email.toString());
      }
    };
    function errorCallbackSession (result: any) {
      result={
        email:""
      };
      //alert('error :'+result.email.toString());
      AppModule.email = '';
      reject(result);
    };
    xrxSessionGetSessionInfo(
      url,
      successCallbackSession,
      errorCallbackSession,
      timeout,
      async,
      ldap
    );
  });}

  export async function Device(url: string, timeout: number , async: boolean): Promise<any> {
    return new Promise((resolve, reject) => {
    function successCallback (envelope: any, response: any)  {
      
     const doc = xrxStringToDom(response);
     const info = doc.querySelector("devcfg\\:Information, Information");
     const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(info.firstChild.data, 'text/xml');
    const generation = Number(xmlDoc.getElementsByTagName('generation')[0].textContent);
    AppModule.Generation = generation;

     const model = xmlDoc.getElementsByTagName('model')[0].textContent;
     AppModule.model = model.toString();
     const deviceId = xmlDoc.getElementsByTagName('serial')[0].textContent;
     AppModule.deviceId = deviceId.toString();
     const isVersalink = _.includes(model.toLowerCase(), 'versalink') || _.includes(model.toLowerCase(), 'primelink');
     const isAltalink = _.includes(model.toLowerCase(), 'altalink');
     const isThirdGenBrowser = _.includes(navigator.userAgent.toLowerCase(), "x3g_");
     AppModule.isThirdGenBrowser = isThirdGenBrowser;
     AppModule.isVersalink = isVersalink;
     AppModule.isAltalink = isAltalink;
     const result = {
        isThirdGenBrowser: isThirdGenBrowser,
        generation: generation,
        isVersalink: isVersalink,
        isAltalink: isAltalink,
        isEighthGen: generation < 9.0,
        model: model
        };
        
        resolve(result);
      };
        function errorCallback  (result: any)  {
        reject(result);};
        xrxDeviceConfigGetDeviceInformation(
        url,
        successCallback,
        errorCallback,
        timeout,
        async
        );
      })
  };
  