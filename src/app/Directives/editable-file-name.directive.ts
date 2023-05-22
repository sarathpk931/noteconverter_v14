import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appEditableFileName]'
})
export class EditableFileNameDirective {
  private initialFileName: string;
  private isEditing = false;

  constructor(private el: ElementRef) { }

  @HostListener('click')
  onClick() {
    if (!this.isEditing) {
      this.initialFileName = this.el.nativeElement.textContent.trim();
      this.el.nativeElement.innerHTML = '';
      const input = document.createElement('input');
      input.value = this.initialFileName;
      input.autofocus = true;
      input.addEventListener('blur', this.onInputBlur.bind(this));
      this.el.nativeElement.appendChild(input);
      input.select();
      this.isEditing = true;
    }
  }

  onInputBlur(event: Event) {
    const input = event.target as HTMLInputElement;
    const newFileName = input.value.trim();
    this.el.nativeElement.innerHTML = newFileName ? newFileName : this.initialFileName;
    this.isEditing = false;
  }
}