import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {Router} from '@angular/router';

import { MatDialogModule,MatDialogRef } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
//import { AppInitializerProvider } from './app-init';
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
/* 
import { AlertBannerComponent } from './views/alert-banner/alert-banner.component';
import { BasicAlertComponent } from './views/basic-alert/basic-alert.component';

import { FileFormatModalComponent } from './views/file-format-modal/file-format-modal.component';*/
import { GeneralAlertComponent } from './views/general-alert/general-alert.component';
/*import { KeypadComponent } from './views/keypad/keypad.component';


import { ProgressBannerComponent } from './views/progress-banner/progress-banner.component';
import { SpinBoxComponent } from './views/spin-box/spin-box.component';
import { ToggleSwitchComponent } from './views/toggle-switch/toggle-switch.component';
import { ImagePreviewerComponent } from './views/image-previewer/image-previewer.component';
import { LogoutConfirmationComponent } from './views/logout-confirmation/logout-confirmation.component'; */
import {LogViewComponent} from '../app/views/log-view/log-view.component';
import {XasStringDirective} from '../app/Directives/xas-string.directive';

//pipes

import { ParseSnmpPipe } from './filters/parse-snmp.pipe';
import { OrderObjectByPipe } from './filters/order-object-by.pipe';
import { ErrorPipe } from './filters/error.pipe';
import { ParseDeviceCapabilitiesPipe } from './filters/parse-device-capabilities.pipe';
import { ParseDevicePrintCapabilitiesPipe } from './filters/parse-device-print-capabilities.pipe';
import { IsUserDeviceAdminPipe } from './filters/is-user-device-admin.pipe';
import { ConvertProtocolPipe } from './filters/convert-protocol.pipe';
import { PasswordMaskPipe } from './filters/password-mask.pipe';
import { StringFormatPipe } from './filters/string-format.pipe';
import { TranslatePipe } from './filters/translate.pipe';
import { ParseDeviceConfigPipe } from './filters/parse-device-config.pipe';
import { ModalService } from './services/modal.service';
import { ScanScreenComponent } from './views/scan-screen/scan-screen.component';
import {ScanService} from './services/scan.service';

import { xrxDeviceConfigGetDeviceInformation } from '../assets/Xrx/XRXDeviceConfig';
import {xrxStringToDom} from '../assets/Xrx/XRXXmlHandler';
import {xrxSessionGetSessionInfo,xrxSessionGetSessionInfoRequest,xrxSessionParseGetSessionInfo}  from  '../assets/Xrx/XRXSession';
import {xrxGetElementValue} from '../assets/Xrx/XRXXmlHandler';
import {xrxCallWebservice,xrxCallAjax} from '../assets/Xrx/XRXWebservices';
import { Global,AppSetting } from './model/global';
import * as _ from 'lodash';

@NgModule({
  declarations: [
    AppComponent,
    LogViewComponent,
    PrivacyPolicyComponent,
    ProgressAlertComponent,
    ScanScreenComponent,
    FeaturePopoverComponent,
    XasStringDirective,
    GeneralAlertComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [{
    provide :APP_INITIALIZER,
    useFactory:()=> Device,
    multi:true,
  },
  {
    provide :APP_INITIALIZER,
    useFactory: ()=> Session,
    multi:true,
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
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  public static Generation:string;
  public static model : string;
 }

export async function Session(url: string,timeout:number,async:boolean, ldap: string): Promise<any> {
  return new Promise((resolve, reject) => {
    function successCallback (envelope: string, response: string) {
      debugger;
      //var data = xrxSessionGetSessionInfoRequest(response);
      var data =xrxSessionParseGetSessionInfo(response);
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data.firstChild, 'text/xml');
      
      
      var userEmail = "";
      if (data !== null) {
        //var userName = xrxGetElementValue(xmlDoc, "username");
        const userName = data.firstChild.getElementsByTagName('qualifiedUsername')[0].firstChild.textContent;
        localStorage.setItem('User Name',userName.toString());
        var password = data.firstChild.getElementsByTagName('qualifiedUsername')[0].lastChild.textContent;
        localStorage.setItem('Password',password.toString());
        if (userName !== null && userName.toLowerCase() !== 'guest')
          userEmail = xrxGetElementValue(data, "from");

        const result ={
          
          email:userEmail
        };
        resolve(result.email.toString());
        Global.Email=result.email.toString();
        if (Global.Email==""){
          Global.Email='test@gmail.com';
        }
      }
    };
    function errorCallback (result: any) {
      result={
        email:""
      };
      reject(result);
    };
    xrxSessionGetSessionInfo(
      url,
      successCallback,
      errorCallback,
      timeout,
      async,
      ldap
    );
  });}

  export async function Device(url: string, timeout: number , async: boolean): Promise<any> {
    return new Promise((resolve, reject) => {
    function successCallback (envelope: any, response: any)  {
   debugger;
     const doc = xrxStringToDom(response);
     const info = doc.querySelector("devcfg\\:Information, Information");
     const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(info.firstChild.data, 'text/xml');
    const generation = Number(xmlDoc.getElementsByTagName('generation')[0].textContent);
    AppModule.Generation = generation.toString();

     const model = xmlDoc.getElementsByTagName('model')[0].textContent;
     AppModule.model = model.toString();
     const isVersalink = _.includes(model.toLowerCase(), 'versalink') || _.includes(model.toLowerCase(), 'primelink');
     const isAltalink = _.includes(model.toLowerCase(), 'altalink');
     const isThirdGenBrowser = _.includes(navigator.userAgent.toLowerCase(), "x3g_");
     const result = {
        isThirdGenBrowser: isThirdGenBrowser,
        generation: generation,
        isVersalink: isVersalink,
        isAltalink: isAltalink,
        isEighthGen: generation < 9.0,
        model: model
        };
        /* localStorage.setItem('Generation',result.generation.toString());
        localStorage.setItem('IsThirdGenBrowser',result.isThirdGenBrowser.toString());
        localStorage.setItem('isVersaLink',result.isVersalink.toString());
        localStorage.setItem('isAltaLink',result.isAltalink.toString());
        localStorage.setItem('isEighthGen',result.isEighthGen.toString());
        localStorage.setItem('Model',result.model.toString()); */

        Global.Generation=result.generation.toString();
        
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