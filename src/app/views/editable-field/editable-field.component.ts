import {  Component, ElementRef, HostListener, Input, OnInit,Renderer2,Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-editable-field',
  templateUrl: './editable-field.component.html',
  styleUrls: ['./editable-field.component.less']
})
export class EditableFieldComponent implements OnInit {

  @Input() name: string;
  @Input() ext: string;
  @Input() locked: boolean;
  @Input() subject: string;
  @Input() subjectlabel: string;
  @Input() placeholder: string;
  @Input() displayFormat: string;

  isPassword: boolean;
  // displayFormat: string;
  // name: string;
  // ext: string;
  strings: any;


  editing: boolean = false;
  renderer : Renderer2;

  constructor(private elementRef: ElementRef,@Inject(DOCUMENT) private document: Document) { }

  @HostListener('tap', ['$event'])
  @HostListener('click', ['$event'])
  @HostListener('focus', ['$event'])

  ngOnInit(): void { 
  }

  onClick(event: MouseEvent) { alert("fffff");
    const inputElement = this.elementRef.nativeElement.querySelector('input');
    inputElement.focus();
    this.getCursorPos(event);

    if (
      this.isInsideActiveIscroll(event) &&
      (event.type === 'click' || event.type === 'focus')
    ) {
      event.stopPropagation();
      event.preventDefault();
      return;
    }

    if (!event.defaultPrevented && !this.locked) {
      const alreadyEditing = this.editing;
      this.editing = true;
      this.updateCss(true);

      setTimeout(() => {
        inputElement.focus();

        if (!alreadyEditing) {
          inputElement.select();
        }

        this.getCursorPos(event);
      }, 300);

      document.removeEventListener('click', this.outsideClick);
      document.addEventListener('click', this.outsideClick);
      inputElement.removeEventListener('blur', this.outsideClick);
      inputElement.addEventListener('blur', this.outsideClick);

      event.stopPropagation();
      event.preventDefault();
    }
  }
  
  private doGetCaretPosition(oField: HTMLInputElement): number {
    let iCaretPos = 0;

    if (window.getSelection) {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(oField);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        iCaretPos = preCaretRange.toString().length;
      }
    } else if (window.getSelection) {
      const selection = window.getSelection();
      oField.focus();
      const range = selection.getRangeAt(0);
      range.setStart(oField, 0);
      range.setEnd(oField, iCaretPos);
      const text = range.toString();
      iCaretPos = text.length;
    }

    return iCaretPos;
  }

  doSetCaretPosition(oField: any, iCaretPos: number) {
    if (oField.setSelectionRange) {
      oField.focus();
      oField.setSelectionRange(iCaretPos, iCaretPos);
    } else if (oField.createTextRange) {
      const range = oField.createTextRange();
      range.collapse(true);
      range.moveEnd('character', iCaretPos);
      range.moveStart('character', iCaretPos);
      range.select();
    }
  }

  private getCursorPos(event: MouseEvent): void {
    const inputElement = this.elementRef.nativeElement.querySelector('input');
    const cursorPos = this.doGetCaretPosition(inputElement);
    this.doSetCaretPosition(inputElement, cursorPos);
  }

  setCursorPos(oField: any, iCaretPos: number): void {
    if (oField.setSelectionRange) {
      oField.focus();
      oField.setSelectionRange(iCaretPos, iCaretPos);
    } else if (oField.createTextRange) {
      const range = oField.createTextRange();
      range.collapse(true);
      range.moveEnd('character', iCaretPos);
      range.moveStart('character', iCaretPos);
      range.select();
    }
  }

  displayText(isPassword: boolean, displayFormat: string, name: string, ext: string, strings: any): string {
    if (isPassword) {
      return this.displayTextAsPassword(name, ext);
    } else if (!displayFormat) {
      return this.displayTextWithoutFormat(name, ext);
    } else {
      let text = strings[displayFormat];
      if (!text) {
        return this.displayTextWithoutFormat(name, ext);
      }
      text = text.replace('{0}', name);
      text = text.replace('{1}', ext);
      return text;
    }
  }

  displayTextWithoutFormat(name: string, ext: string): string {
    if (!ext) {
      return name;
    } else {
      return name + ext;
    }
  }
  
   displayTextAsPassword(name: string, ext: string): string {
    const text = this.displayTextWithoutFormat(name, ext);
    if (!text) {
      return null;
    }
    return "•".repeat(text.length);
  }

  fieldType(isPassword: boolean): string {
    if (isPassword) {
      return "password";
    } else {
      return "text";
    }
  }

  updateCss(edit: boolean): void {
    if (edit) {
      this.renderer.setStyle(this.elementRef.nativeElement.querySelector('input'), 'box-shadow', 'none');
      this.renderer.addClass(this.elementRef.nativeElement.querySelector('span#_glyph'), 'option-text');
      this.renderer.addClass(this.elementRef.nativeElement.querySelector('span#_subject'), 'option-text');
    } else {
      this.renderer.removeClass(this.elementRef.nativeElement.querySelector('span#_glyph'), 'option-text');
      this.renderer.removeClass(this.elementRef.nativeElement.querySelector('span#_subject'), 'option-text');
    }
  }

  handleKeyEnter(event: KeyboardEvent): void {
    if (event.keyCode === 13) {
      this.elementRef.nativeElement.blur();
      document.removeEventListener('tap', this.outsideClick);
      document.removeEventListener('click', this.outsideClick);
      this.editing = false;
      this.updateCss(false);
      if (typeof (window as any).EIP_CloseEmbeddedKeyboard === 'function') {
        (window as any).EIP_CloseEmbeddedKeyboard(); //dismiss device keyboard
      }
  
      // Fix for bug XBB-384
      event.stopPropagation();
      event.preventDefault();
      return;
    }
  }

  outsideClick(): void {
    window.scrollTo(0, -100);
    const scrollContainer = document.getElementsByClassName('scroll-container')[0] as HTMLElement;
    scrollContainer.scrollTop = 0;
    setTimeout(() => {
      document.removeEventListener('click', this.outsideClick);
      this.editing = false;
      this.updateCss(false);
      if (typeof (window as any).EIP_CloseEmbeddedKeyboard === 'function') {
        (window as any).EIP_CloseEmbeddedKeyboard(); //dismiss device keyboard
      }
    });
  }

  private isInsideActiveIscroll(event: MouseEvent): boolean {
    const target = event.target as HTMLElement;
    return (
      target.closest('.wrapper') !== null &&
      (event.type === 'click' || event.type === 'focus')
    );
  }

  // onClick() {
  //   if (!this.isEditing) {
  //     this.initialFileName = this.el.nativeElement.textContent.trim();
  //     this.el.nativeElement.innerHTML = '';
  //     const input = document.createElement('input');
  //     input.value = this.initialFileName;
  //     input.autofocus = true;
  //     input.addEventListener('blur', this.onInputBlur.bind(this));
  //     this.el.nativeElement.appendChild(input);
  //     input.select();
  //     this.isEditing = true;
  //   }
  // }

  onInputBlur() {
    this.outsideClick();
  }
}


