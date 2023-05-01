import { Pipe, PipeTransform } from '@angular/core';
import { xrxStringToDom, xrxFindElement, xrxGetValue, xrxDomToString,xrxGetTheElement, xrxFindElements, xrxGetElementValue } from '../../assets/Xrx/XRXXmlHandler';
import {xrxDeviceConfigParseGetDeviceCapabilities} from '../../assets/Xrx/XRXDeviceConfig'

@Pipe({
  name: 'parseDeviceCapabilities'
})
export class ParseDeviceCapabilitiesPipe implements PipeTransform {
  transform(envelope: any): any[] {
    const deviceCaps: string[] = [];
    const deviceCapabilites = xrxDeviceConfigParseGetDeviceCapabilities(envelope);
    const deviceJobProcessingCaps = xrxGetTheElement(deviceCapabilites, "DeviceJobProcessingCapabilities");
    const deviceCapsByService = xrxGetTheElement(deviceJobProcessingCaps, "DeviceJobProcessingCapabilitiesByServices");

    if (deviceCapsByService != null) {
      const capsByService = xrxFindElements(deviceCapsByService, "CapabilitiesByService");
      capsByService.forEach(capByService => {
        const serviceType = xrxGetElementValue(capByService, "ServiceType").toLowerCase();
        switch (serviceType) {
          case 'copy':
            deviceCaps.push('Copy');
            break;
          case 'workflowscanning':
            deviceCaps.push('Scan');
            break;
          case 'internetfaxsend':
          case 'faxsend':
            if (!deviceCaps.includes('Fax')) {
              deviceCaps.push('Fax');
            }
            break;
          case 'print':
            deviceCaps.push('Print');
            break;
        }
      });
    }

    return deviceCaps;
  }
}
