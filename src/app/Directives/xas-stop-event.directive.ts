import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: 'XasStopEvent'
})
export class XasStopEventDirective {

  constructor(private el: ElementRef) { }

  @HostListener('tap', ['$event'])
  @HostListener('click', ['$event'])
  onClick(event: Event): void {
    if (event.target === this.el.nativeElement) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

}
