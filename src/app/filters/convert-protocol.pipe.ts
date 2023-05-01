import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertProtocol'
})
export class ConvertProtocolPipe implements PipeTransform {
  transform(protocol: string): string {
    let result = "";
    switch (protocol) {
      case "to":
        result = "SDE_TO5";
        break;
      case "cc":
        result = "SDE_CC1";
        break;
      case "bcc":
        result = "SDE_BCC1";
        break;
      default:
        result = "SDE_TO5";
    }
    return result;
  }
}
