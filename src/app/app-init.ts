// import { APP_INITIALIZER } from '@angular/core';
// import { xrxDeviceConfigGetDeviceInformation } from '../assets/Xrx/XRXDeviceConfig';
// import {xrxStringToDom} from '../assets/Xrx/XRXXmlHandler';
// import {xrxSessionGetSessionInfo,xrxSessionGetSessionInfoRequest,xrxSessionParseGetSessionInfo}  from  '../assets/Xrx/XRXSession';
// import {xrxGetElementValue} from '../assets/Xrx/XRXXmlHandler';
// import {xrxCallWebservice,xrxCallAjax} from '../assets/Xrx/XRXWebservices';
// import { Global,AppSetting } from './model/global';
// import * as _ from 'lodash';

// export function appInit() {
//   return () => {
//     console.log('App init!');
//     (window as any)._ = _;
    
//     //Strings();
//     /* Device(AppSetting.url,AppSetting.timout,AppSetting.async).then((result)=>{

//       Global.Generation=result.generation.toString();
//       Global.isEighthGen=result.isEighthGen;
//       Global.isThirdGenBrowser=result.IsThirdGenBrowser;

//     }); */
//     /* Session(AppSetting.url,AppSetting.timout,AppSetting.async,AppSetting.ldap).then((value)=>{

//       Global.Email=value;
      
//     }); */
//    // generateNewJobID();
//     //validateEmail('test@example.com');

//   }
// }

// /* export const AppInitializerProvider = {
//   provide: APP_INITIALIZER,
//   useFactory: appInit,generateNewJobID,validateEmail,
//   multi: true
// };
//  */

// export function generateNewJobID() {
//   const guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
//   const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
//   return v.toString(16);
//   });

//   localStorage.setItem('jobId',guid);
//   console.log(guid);
//   return guid;
// }

// export function validateEmail(emailArg: string) {
//   const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
//   const result = regex.test(emailArg);
//   localStorage.setItem('IsEmailValid',result.toString());
//   console.log(result);
//   return result;
// }


// export async function Strings()
// {
//   var regex = /(\w+)\-?/g;
//   const locale = 'en';//regex.exec(window.navigator.language || window.navigator.language)[1] || 'en';
//   const response = await fetch(`api/strings?lang=${encodeURIComponent(locale)}`);
//   const data = await response.json();
//   console.log('locale',data.strings)
//   localStorage.setItem('locale',data.strings);
//   return data.strings;
// };



 