import { Directive, ElementRef, HostBinding, HostListener, Input, } from '@angular/core';

@Directive({
  selector: 'appTextField'
})
export class TextFieldDirective {
  @Input() initialValue: string; 
  @Input() readOnlyClass: string;
  @Input() editableClass : string;

  private editMode = false; 
  private editableText: string;
  
  @HostBinding ('class') hostClasses = '';
  //@HostBinding (editableClass) editmode = true;

  constructor(private elementRef: ElementRef<HTMLInputElement>) { }

  @HostListener('click') onClick() { 
    this.editMode = true; 
    this.hostClasses =`${this.editableClass}`;
    this.editableText = this.initialValue || ''; 
    const childNode = this.elementRef.nativeElement.firstElementChild as HTMLInputElement;

    childNode.focus(); 
    childNode.select(); 
  } 

  @HostListener('blur') onBlur() { 
    this.hostClasses =`${this.readOnlyClass}`;
    this.editMode = false; 
  } 

  @HostListener('keydown.enter') onEnter() { 
    this.elementRef.nativeElement.blur(); 
  } 

}

