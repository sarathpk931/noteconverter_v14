import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Router} from '@angular/router';

import { xrxDeviceConfigGetDeviceInformation } from '../assets/Xrx/XRXDeviceConfig';
import {xrxStringToDom} from '../assets/Xrx/XRXXmlHandler';
import {xrxSessionGetSessionInfo,xrxSessionGetSessionInfoRequest,xrxSessionParseGetSessionInfo}  from  '../assets/Xrx/XRXSession';
import {xrxGetElementValue} from '../assets/Xrx/XRXXmlHandler';
import {xrxCallWebservice,xrxCallAjax} from '../assets/Xrx/XRXWebservices';
import { LogService } from '../app/services/log.service';
import {ResourcestringService} from '../app/services/resourcestring.service';
import {AppSetting, resourceString} from './model/global';
import { RadioControlValueAccessor } from '@angular/forms';
import {environment} from  '../environments/environment'


declare const _: any;

let Deviceconfigxmlresponse:string;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title: "Note Converter App";
  env = environment;

  constructor(
    
    private  logger: LogService,
    private http: HttpClient,
    private router : Router,
    private resourceStringService : ResourcestringService
    ) 
    { }

  
    ngOnInit() { 
      this.routeScanScreen(); 
    } 
    async routeScanScreen() 
    { 
      try { 
        const strings = await this.Strings(); 
        this.router.navigate(['scanScreen']); 
      } 
      catch (error) 
      { 
        
      } 
    } 
    
    Strings = async () => { 
      try { 
          var regex = /(\w+)\-?/g; 
          const locale = regex.exec(window.navigator.language || window.navigator.language)[1] || 'en-US'; 
          const result: any = await this.http.get(this.env.wncAppAddress + `/api/strings?lang=${encodeURIComponent(locale)}`).toPromise(); 
          this.resourceStringService.objStrings = result.strings; 
          return result.strings; 
        } 
          catch (error) { 
           
          } 
        };

   
    //const locale = navigator.language;
    
    // data =  {

    //    SDE_REQUIRED_FIELD1:"This is a required field.",
      
    //    SDE_FMTSTRFMTSTR_XEROX_CORPORATION2:"©{0}XeroxC orporation.Allbrights reserved.",
    //    SDE_11_X_173:"11x17",
    //    ONE_SIDED: "1-Sided",
    //    SDE_1SIDED : "1-Sided",
    //    SDE_2SIDED_SCANNING: "2-Sided Scanning",
    // }
    //debugger;
    
    //this.resourceStringService.processApiResponse(data);
    //debugger;
    //  const data =  await response.json();
   // const response = await fetch(`api/strings?lang=${encodeURIComponent(locale)}`);
    //const data = await response.json();
    // if(data != null)
    // {
    //   return data.strings;
    // }
    // else {
    //   return null;
    // }
    
     //console.log('locale',data.strings)
     //localStorage.setItem('locale',data.strings);
    // return data.strings;
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
  


