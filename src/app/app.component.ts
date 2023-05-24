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
    
    ) 
    { }

  
  ngOnInit(){
    //alert("Before strings");
    this.Strings();
    //alert("after strings");
    this.router.navigate(['scanScreen']);
    //this.Device(AppSetting.url,5000,true);
  }


 Strings = async () => {
  //alert("inside strings");
    var regex = /(\w+)\-?/g;
    const locale = regex.exec(window.navigator.language || window.navigator.language)[1] || 'en-US';
    //const locale = navigator.language;
    let data : any;

    const response = this.http.get(this.env.wncAppAddress+ `/api/strings?lang=${encodeURIComponent(locale)}`).toPromise()
    .then((result: any) =>{ 
      //alert("inside success strings");
       data = result;
      //localStorage.setItem('locale',data.strings);
      alert("string : "+ data.strings["ONE_SIDED"]);
    })
    //debugger;
    //  const data =  await response.json();
   // const response = await fetch(`api/strings?lang=${encodeURIComponent(locale)}`);
    //const data = await response.json();
    if(data != null)
    {
      return data.strings;
    }
    else {
      return null;
    }
    
     //console.log('locale',data.strings)
     //localStorage.setItem('locale',data.strings);
    // return data.strings;
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
  


