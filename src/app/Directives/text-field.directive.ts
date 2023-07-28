/**
 *  This directive is used to change the class of a controlon click and blur events
 */
import { Directive, ElementRef, HostBinding, HostListener, Input, } from '@angular/core';

@Directive({
  selector: 'appTextField'
})
export class TextFieldDirective {
  @Input() initialValue: string; 
  @Input() readOnlyClass: string;
  @Input() editableClass : string;
  @Input() locked: boolean = false;
  

  private editMode = false; 
  private editableText: string;
  editing: boolean = false;
  currentTextField: ElementRef | null = null;
  
  @HostBinding ('class') hostClasses = '';
  //@HostBinding (editableClass) editmode = true;

  constructor(private elementRef: ElementRef<HTMLInputElement>) { }

  ngOnInit(){
    this.elementRef.nativeElement.querySelector('input').setAttribute('readonly', 'true');
    
  }

  @HostListener('click') onClick() { 
    this.editMode = true; 
    this.hostClasses =`${this.editableClass}`;
    this.editableText = this.initialValue || ''; 
    const childNode = this.elementRef.nativeElement.firstElementChild as HTMLInputElement;

    childNode.focus(); 
    childNode.select(); 
  } 

  @HostListener('tap', ['$event'])
  @HostListener('click', ['$event'])
  onTextFieldClick(event: Event) {
    this.currentTextField = this.elementRef;

    if (
      event.target instanceof Element &&
      event.target.closest('.wrapper') !== null &&
      event.type === 'click'
    ) {
      event.stopPropagation();
      event.preventDefault();
      return;
    }

    this.elementRef.nativeElement.querySelector('input').removeAttribute('readonly');

    if (!event.defaultPrevented && !this.locked) {
      const alreadyEditing = this.editing;
      this.scrollTextFieldIntoView();

      setTimeout(() => {
        this.editing = true;
      }, 50);

      setTimeout(() => {
        this.elementRef.nativeElement.querySelector('input').focus();
        if (!alreadyEditing) {
          this.elementRef.nativeElement.querySelector('input').select();
        }
      }, 200);

      document.removeEventListener('tap', this.outsideClick);
      document.removeEventListener('click', this.outsideClick);
      document.addEventListener('tap', this.outsideClick);
      document.addEventListener('click', this.outsideClick);

      event.stopPropagation();
      event.preventDefault();
    }
  }

  @HostListener('blur') onBlur() { 
    this.hostClasses =`${this.readOnlyClass}`;
    this.editMode = false; 
  } 

  @HostListener('keydown.enter') onEnter() { 
    this.elementRef.nativeElement.blur(); 
  } 

  /* handleKeyEnter(key: KeyboardEvent) {
    if (key.key === 'Enter') {
      key.stopPropagation();
      key.preventDefault();
      this.outsideClick();
      return false;
    }
  } */

  outsideClick(event: MouseEvent) {
    const targetNode = event.target as Node;

    if (this.editMode && !this.elementRef.nativeElement.contains(targetNode)) {
      this.editMode = false;
      this.hostClasses = `${this.readOnlyClass}`;
    }

  }

  scrollTextFieldIntoView() {
    // Implement the logic for scrolling the element into view (same as in the AngularJS code)
  }
}

