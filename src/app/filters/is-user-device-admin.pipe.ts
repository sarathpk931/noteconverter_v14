import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
import { xrxStringToDom, xrxFindElement, xrxGetValue, xrxDomToString,xrxGetTheElement, xrxFindElements, xrxGetElementValue } from '../../assets/Xrx/XRXXmlHandler';
import {xrxDeviceConfigParseGetDeviceCapabilities} from '../../assets/Xrx/XRXDeviceConfig';
import{xrxSessionParseGetSessionInfo} from '../../assets/Xrx/XRXSession';

@Pipe({
  name: 'isUserDeviceAdmin'
})
export class IsUserDeviceAdminPipe implements PipeTransform {
  transform(envelope: any): boolean {
    const parsedSessionInfo = xrxSessionParseGetSessionInfo(envelope);

    if (parsedSessionInfo != null) {
      const rolesElement = xrxGetTheElement(parsedSessionInfo, 'roles');
      if (rolesElement != null) {
        const authorizedElement = xrxGetTheElement(rolesElement, 'authorized');
        if (authorizedElement != null) {
          const rolesAuthorizedRoleElements = xrxFindElements(authorizedElement, 'role');
          if (rolesAuthorizedRoleElements != null) {
            // determine if user is sys. admin
            const indexOfAdminRole = _.findIndex(rolesAuthorizedRoleElements, function (o) { return xrxGetElementValue(o, 'role').toLowerCase() == 'xesystemadministrator' });
            if (indexOfAdminRole > -1) {
              return true;
            }
          }
        }
      }
    }

    return false;
  }
}
