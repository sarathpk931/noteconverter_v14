import { Directive, ElementRef, HostBinding, HostListener, Input } from '@angular/core';

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

  @HostListener('click') onClick() { //alert("focus");
    this.editMode = true; 
    this.hostClasses =`${this.editableClass}`;
    this.editableText = this.initialValue || ''; 

    this.elementRef.nativeElement.focus(); 
    this.elementRef.nativeElement.select(); 
  } 

  @HostListener('blur') onBlur() { //alert("blur");
    this.hostClasses =`${this.readOnlyClass}`;
    this.editMode = false; 
  } 

  @HostListener('keydown.enter') onEnter() { 
    this.elementRef.nativeElement.blur(); 
  } 

}

