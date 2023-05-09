import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Router} from '@angular/router';

import { xrxDeviceConfigGetDeviceInformation } from '../assets/Xrx/XRXDeviceConfig';
import {xrxStringToDom} from '../assets/Xrx/XRXXmlHandler';
import {xrxSessionGetSessionInfo,xrxSessionGetSessionInfoRequest,xrxSessionParseGetSessionInfo}  from  '../assets/Xrx/XRXSession';
import {xrxGetElementValue} from '../assets/Xrx/XRXXmlHandler';
import {xrxCallWebservice,xrxCallAjax} from '../assets/Xrx/XRXWebservices';
import { LogService } from '../app/services/log.service';
import {AppSetting, Global} from './model/global';
import { RadioControlValueAccessor } from '@angular/forms';


declare const _: any;

let Deviceconfigxmlresponse:string;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title: "Note Converter App";

  constructor(
    
    private  logger: LogService,
    private http: HttpClient,
    private router : Router,
    
    ) 
    { }

  
  ngOnInit(){
    this.router.navigate(['scanScreen']);
  }


 Strings = async () => {
    var regex = /(\w+)\-?/g;
    const locale = regex.exec(window.navigator.language || window.navigator.language)[1] || 'en';
    //const locale = navigator.language;
    const response = await fetch(`api/strings?lang=${encodeURIComponent(locale)}`);
    const data = await response.json();
    console.log('locale',data.strings)
    localStorage.setItem('locale',data.strings);
    return data.strings;
  }
}
  /*
  
  Device(url: string, timeout: number , async: boolean): Promise<any> {
    return new Promise((resolve, reject) => {
    function successCallback (envelope: any, response: any)  {
   
     const doc = xrxStringToDom(response);
     const info = doc.querySelector("devcfg\\:Information, Information");
     const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(info.firstChild.data, 'text/xml');
    const generation = Number(xmlDoc.getElementsByTagName('generation')[0].textContent);

     const model = xmlDoc.getElementsByTagName('model')[0].textContent;
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
        localStorage.setItem('Generation',result.generation.toString());
        localStorage.setItem('IsThirdGenBrowser',result.isThirdGenBrowser.toString());
        localStorage.setItem('isVersaLink',result.isVersalink.toString());
        localStorage.setItem('isAltaLink',result.isAltalink.toString());
        localStorage.setItem('isEighthGen',result.isEighthGen.toString());
        localStorage.setItem('Model',result.model.toString());
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
      });
    
    }

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
  


