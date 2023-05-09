import { APP_INITIALIZER } from '@angular/core';
import { xrxDeviceConfigGetDeviceInformation } from '../assets/Xrx/XRXDeviceConfig';
import {xrxStringToDom} from '../assets/Xrx/XRXXmlHandler';
import {xrxSessionGetSessionInfo,xrxSessionGetSessionInfoRequest,xrxSessionParseGetSessionInfo}  from  '../assets/Xrx/XRXSession';
import {xrxGetElementValue} from '../assets/Xrx/XRXXmlHandler';
import {xrxCallWebservice,xrxCallAjax} from '../assets/Xrx/XRXWebservices';
import { Global,AppSetting } from './model/global';
import * as _ from 'lodash';

export function appInit() {
  return () => {
    console.log('App init!');
    (window as any)._ = _;
    
    Strings();
    Device(AppSetting.url,AppSetting.timout,AppSetting.async).then((result)=>{

      Global.Generation=result.generation.toString();
      Global.isEighthGen=result.isEighthGen;
      Global.isThirdGenBrowser=result.IsThirdGenBrowser;

    });
    Session(AppSetting.url,AppSetting.timout,AppSetting.async,AppSetting.ldap).then((value)=>{

      Global.Email=value;
      
    });
    generateNewJobID();
    validateEmail('test@example.com');

  }
}

export const AppInitializerProvider = {
  provide: APP_INITIALIZER,
  useFactory: appInit,generateNewJobID,validateEmail,
  multi: true
};


export function generateNewJobID() {
  const guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
  const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
  return v.toString(16);
  });

  localStorage.setItem('jobId',guid);
  console.log(guid);
  return guid;
}

export function validateEmail(emailArg: string) {
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
  const result = regex.test(emailArg);
  localStorage.setItem('IsEmailValid',result.toString());
  console.log(result);
  return result;
}


export async function Strings()
{
  var regex = /(\w+)\-?/g;
  const locale = regex.exec(window.navigator.language || window.navigator.language)[1] || 'en';
  const response = await fetch(`api/strings?lang=${encodeURIComponent(locale)}`);
  const data = await response.json();
  console.log('locale',data.strings)
  localStorage.setItem('locale',data.strings);
  return data.strings;
};

export async function Device(url: string, timeout: number , async: boolean): Promise<any> {
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
    })
};

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
    });
}