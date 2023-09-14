/**
 *  This directive is used to manipulate the placeholder string in email text field
 */
import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';

@Directive({
  selector: '[xasPlaceholder]'
})
export class XasPlaceholderDirective {

  @Input() xasPlaceholder: string;

  private onFocus = (e: Event) => {
    this.elementRef.nativeElement.classList.add('keepPlaceHolder');
    this.elementRef.nativeElement.classList.add('placeholderFont');
  };

  private onBlur = (e: Event) => {
    const target = e.target as HTMLElement;
    target.classList.remove('keepPlaceHolder');
    target.classList.remove('removePlaceholder');
    target.classList.remove('placeholderFont');
  };

  private onKeyPress = (e: Event) => {
    const target = e.target as HTMLElement;
    if (target['value'] != null) {
      target.classList.add('removePlaceholder');
      target.classList.remove('keepPlaceHolder');
    }
  };

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.elementRef.nativeElement.addEventListener('focus', this.onFocus);
    this.elementRef.nativeElement.addEventListener('blur', this.onBlur);
    this.elementRef.nativeElement.addEventListener('input', this.onKeyPress);
  }

  ngOnDestroy() {
    this.elementRef.nativeElement.removeEventListener('focus', this.onFocus);
    this.elementRef.nativeElement.removeEventListener('blur', this.onBlur);
    this.elementRef.nativeElement.removeEventListener('input', this.onKeyPress);
  }

}
