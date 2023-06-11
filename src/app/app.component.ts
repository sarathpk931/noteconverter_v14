import { Component, OnInit } from '@angular/core';
//import { HttpClient } from '@angular/common/http';
import {Router} from '@angular/router';

// import { xrxDeviceConfigGetDeviceInformation } from '../assets/Xrx/XRXDeviceConfig';
// import {xrxStringToDom} from '../assets/Xrx/XRXXmlHandler';
// import {xrxSessionGetSessionInfo,xrxSessionGetSessionInfoRequest,xrxSessionParseGetSessionInfo}  from  '../assets/Xrx/XRXSession';
// import {xrxGetElementValue} from '../assets/Xrx/XRXXmlHandler';
// import {xrxCallWebservice,xrxCallAjax} from '../assets/Xrx/XRXWebservices';
//import { LogService } from '../app/services/log.service';
import {ResourcestringService} from '../app/services/resourcestring.service';
import {ModalService} from '../app/services/modal.service';
//import {ConfigurationService} from '../app/services/configuration.service';
//import {environment} from  '../environments/environment'
//import {AppSetting} from '../app/model/global';


declare const _: any;

//let Deviceconfigxmlresponse:string;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  //title: "Note Converter App";
  //env = environment;

  constructor(
    
    // private  logger: LogService,
    // private http: HttpClient,
    private router : Router,
    private resourceStringService : ResourcestringService,
    private modalService: ModalService,
    //private configurationService : ConfigurationService
    ) 
    { 
     //this.resourceStringService.loadResources()
    }

  
    ngOnInit() { 
      this.routeScanScreen(); 
    } 
    async routeScanScreen() 
    { 
      this.modalService.showProgressAlert('','');
      try { 
        //await this.configurationService.Device(AppSetting.url,AppSetting.timout,AppSetting.async);
        await this.resourceStringService.loadResources(); 
        this.router.navigate(['scanScreen']); 
        this.modalService.closeAllModals();
      } 
      catch (error) 
      { 
        
      } 
    } 
    
   
  }
  
/*
  Session(url: string,timeout:number,async:boolean, ldap: string): Promise<any> {
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
    }); */
  


