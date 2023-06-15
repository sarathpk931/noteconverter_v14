import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { StorageService } from './storage.service';
import { ActivatedRoute } from '@angular/router';
import {AppModule} from '../../app/app.module';
import { xrxDeviceConfigGetDeviceInformation } from '../../assets/Xrx/XRXDeviceConfig';
import {xrxStringToDom} from '../../assets/Xrx/XRXXmlHandler';
//import {xrxGetElementValue} from '../../assets/Xrx/XRXXmlHandler';
import * as _ from 'lodash';


@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  private storageProvider = this.storageService.getLocalStorage(true);

  constructor(private location: Location, private storageService: StorageService,private route: ActivatedRoute) {}

  parseUrlParams() {
    function fullyDecode(urlParam: string) {
      let result = urlParam;
      while (result !== decodeURIComponent(result)) {
        result = decodeURIComponent(result);
      }
      return result;
    }

    const qs = window.location.search;

    

    if (!qs) { return this.route.queryParams.subscribe(); } //do with params like subscribe(params => {const userId = params['userId'];});

    const result: any[] = [];
    if (qs[0] === "?") {
      const params = qs.slice(1).split('&');
      for (let i = 0; i < params.length; i++) {
        const param = params[i].split('=');
        result.push(param[0]);
        result[param[0]] = fullyDecode(param[1]);
      }
    }

    return result;
  }

  getSetting(settingName: string) {
    const params = this.parseUrlParams();
    let setting = params[settingName];

    if (setting) {
      this.cacheSetting(settingName, setting);
    } else {
      setting = this.storageProvider.getItem(settingName);
    }

    return setting;
  }

  cacheSetting(settingName: string, setting: any) {
    this.storageProvider.setItem(settingName, setting);
  }

  clearQueryString() {
    this.route.queryParams.subscribe({}); 
  }

   Device(url: string, timeout: number , async: boolean): Promise<any> {
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
}
