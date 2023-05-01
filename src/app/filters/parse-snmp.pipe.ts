import { Pipe, PipeTransform } from '@angular/core';
//import * as $ from 'jquery';
import * as _ from 'lodash';
import { xrxStringToDom, xrxFindElement, xrxGetValue, xrxDomToString,xrxGetTheElement, xrxFindElements, xrxGetElementValue } from '../../assets/Xrx/XRXXmlHandler';
import {xrxDeviceConfigParseGetDeviceCapabilities} from '../../assets/Xrx/XRXDeviceConfig'

@Pipe({
  name: 'parseSnmp'
})
export class ParseSnmpPipe implements PipeTransform {
  transform(snmp: string): any {
    const doc = xrxStringToDom(snmp);
    const el = xrxFindElement(doc, ['returnValue']);
    const result = xrxGetValue(el);

    return {
      value: result
    };
  }
}
