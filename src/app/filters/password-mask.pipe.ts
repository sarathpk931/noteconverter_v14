import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'passwordMask'
})
export class PasswordMaskPipe implements PipeTransform {
  transform(input: string): string {
    let result = '';

    if (input) {
      const split = input.split('');
      for (let i = 0; i < split.length; i++) {
        result += '•';
      }
    }

    return result;
  }
}