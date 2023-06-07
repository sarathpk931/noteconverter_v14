import { Injectable } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';
//import * as $ from 'jquery';
import * as _ from 'lodash';
import { xrxStringToDom, xrxFindElement, xrxGetValue, xrxDomToString,xrxGetTheElement, xrxFindElements, xrxGetElementValue } from '../../assets/Xrx/XRXXmlHandler';
import {xrxDeviceConfigParseGetDeviceCapabilities} from '../../assets/Xrx/XRXDeviceConfig';

@Pipe({
  name: 'parseDeviceConfig'
})
export class ParseDeviceConfigPipe implements PipeTransform {
    transform(envelope: string): any {
      const doc = xrxStringToDom(envelope);
      const el = xrxFindElement(doc, ['DeviceInformationResponse', 'Information']);
      const rawInfo = xrxGetValue(el);
  
      let info, device, style;
      if (rawInfo.length < 4096) {
        info = xrxStringToDom(rawInfo);
        device = xrxFindElement(info, ['DeviceInformation', 'device']);
        style = xrxFindElement(info, ['DeviceInformation', 'style']);
      } else {
        device = xrxStringToDom(
          "<?xml version='1.0' encoding='UTF-8'?><device>" +
            rawInfo.split('<device>')[1].split('</device>')[0] +
            '</device>'
        );
        style = xrxStringToDom(
          "<?xml version='1.0' encoding='UTF-8'?><style>" +
            rawInfo.split('<style>')[1].split('</style>')[0] +
            '</style>'
        );
      }
  
      const major = (rawInfo).find('eipSoftware > majorVersion').text();
      const minor = (rawInfo).find('eipSoftware > minorVersion').text();
      const revision = (rawInfo).find('eipSoftware > revision').text();
  
      return {
        xml: xrxDomToString(device),
        deviceName: xrxGetValue(xrxFindElement(device, ['name'])),
        macAddress: xrxGetValue(xrxFindElement(device, ['mac'])),
        serialNumber: xrxGetValue(xrxFindElement(device, ['serial'])),
        modelName: xrxGetValue(xrxFindElement(device, ['model'])),
        eipMajorVersion: major,
        eipMinorVersion: minor,
        eipRevision: revision,
        hasSNMPWS: (rawInfo).find('SNMPWS').length > 0,
        generation: xrxGetValue(xrxFindElement(style, ['generation'])),
        eipVersion: parseFloat(major + '.' + minor + '.' + revision),
      };
    }
  }
