import { Pipe, PipeTransform } from '@angular/core';
import { xrxStringToDom, xrxFindElement, xrxGetValue, xrxDomToString,xrxGetTheElement, xrxFindElements, xrxGetElementValue } from '../../assets/Xrx/XRXXmlHandler';

interface ErrorDetails {
  exceptionType?: string;
  exceptionMessage?: string;
}

@Pipe({
  name: 'error'
})

/* interface ErrorDetails {
  exceptionType?: string;
  exceptionMessage?: string;
} */

export class ErrorPipe implements PipeTransform {
  transform(errorResponse: string): ErrorDetails {
    const errorDetails: ErrorDetails = {};

    const errorString = errorResponse.match(/<faultstring>(.*)<\/faultstring>/);
    const detail = errorResponse.match(/<detail(.*)<\/detail>/);

    if (detail) {
      const doc = xrxStringToDom(detail[0]);
      const webletElement = xrxFindElement(doc, ['WebletModificationDisabledException']);
      const authElement = xrxFindElement(doc, ['FailedAuthenticationException']) || xrxFindElement(doc, ['FailedAuthentication']);
      const regFullElement = xrxFindElement(doc, ['RegistryFullException']);

      if (webletElement) {
        errorDetails.exceptionType = 'WebletModificationDisabledException';
        errorDetails.exceptionMessage = 'SDE_INSTALLATION_CONNECTKEY_APPS';
      } else if (authElement) {
        errorDetails.exceptionType = 'FailedAuthenticationException';
        errorDetails.exceptionMessage = 'SDE_DEVICE_ADMINISTRATOR_USERNAME';
      } else if (regFullElement) {
        errorDetails.exceptionType = 'RegistryFullException';
        errorDetails.exceptionMessage = 'SDE_MAXIMUM_NUMBER_APPS';
      }
    }

    return errorDetails;
  }
}
