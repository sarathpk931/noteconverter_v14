import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stringFormat'
})
export class StringFormatPipe implements PipeTransform {
  transform(input: string, params: any[]): string {
    let str = input;

    if (!str) {
      return input;
    }

    str.match(/\{(\d)\}/g)?.forEach((item, index) => {
      str = str.replace(item, params[index]);
    });

    return str;
  }
}