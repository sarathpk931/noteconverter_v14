import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderObjectBy'
})
@Pipe({
  name: 'orderObjectBy'
})
export class OrderObjectByPipe implements PipeTransform {
  transform(items: any[], field: string, reverse: boolean): any[] {
    const filtered = [...items];
    filtered.sort((a, b) => (a[field] > b[field] ? 1 : -1));
    if (reverse) filtered.reverse();
    return filtered;
  }
}