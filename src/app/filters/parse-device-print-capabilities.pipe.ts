import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'parseDevicePrintCapabilities'
})
export class ParseDevicePrintCapabilitiesPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
