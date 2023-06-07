import { Directive, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';
//import  {IScroll} from 'iscroll'

@Directive({
  selector: '[ngScrollable]'
})
export class NgScrollableDirective  { //implements OnInit, OnDestroy
  
  private $scrollEnd: any;

  @Input() ngScrollable: any;
  @Input() bounce: string;
  @Input() disableMouse: string;
  @Input() disablePointer: string;
  @Input() disableTouch: string;
  @Input() freeScroll: string;
  @Input() hwCompositing: string;
  @Input() momentum: string;
  @Input() mouseWheel: string;
  @Input() preventDefault: string;
  @Input() probeType: string;
  @Input() scrollbars: string;
  @Input() scrollX: string;
  @Input() scrollY: string;
  @Input() tap: string;
  @Input() useTransform: string;
  @Input() useTransition: string;

  private scroller: any;
  private currentY: number = 0;

  private shadowDiv: HTMLDivElement | null;

  constructor(private elementRef: ElementRef) { }

  ngOnInit(): void {
    const element = this.elementRef.nativeElement as HTMLElement;
    const device = {
      isThirdGenBrowser: false, // Replace with your condition
      generation: 9.0 // Replace with your value
    };

    if (!device.isThirdGenBrowser && device.generation >= 9.0) {
      this.link(element);
    } else {
      if (this.scrollY !== 'false') {
        element.style.overflowY = 'auto';
        element.style.position = 'relative';
        this.shadowDiv = document.createElement('div');
        this.shadowDiv.className = 'shadow';
        this.shadowDiv.style.position = 'fixed';
        element.appendChild(this.shadowDiv);

        setTimeout(() => {
          const offset = element.getBoundingClientRect();
          const borderTop = parseInt(getComputedStyle(element).borderTopWidth || '0');
          const borderLeft = parseInt(getComputedStyle(element).borderLeftWidth || '0');

          this.shadowDiv!.style.top = `${offset.top + borderTop}px`;
          this.shadowDiv!.style.left = `${offset.left + borderLeft}px`;
          this.shadowDiv!.style.height = `${element.clientHeight}px`;
          this.shadowDiv!.style.width = `${element.clientWidth}px`;

          if (element.offsetHeight < element.scrollHeight) {
            this.shadowDiv!.classList.add('shadow-bottom');
          }
        }, 500);

        element.addEventListener('scroll', () => {
          const movingHeight = element.firstElementChild?.clientHeight || 0;
          const scrollTop = element.scrollTop;
          const scrollableHeight = element.clientHeight;
          const delta = movingHeight - scrollableHeight;
          const atBottom = scrollTop >= delta;

          this.shadowDiv!.style.width = `${element.clientWidth}px`;
          this.shadowDiv!.style.height = `${element.clientHeight}px`;

          if (atBottom) {
            this.shadowDiv!.classList.remove('shadow-bottom');
          } else {
            this.shadowDiv!.classList.add('shadow-bottom');
          }

          if (scrollTop === 0) {
            this.shadowDiv!.classList.remove('shadow-top');
          } else {
            this.shadowDiv!.classList.add('shadow-top');
          }
        });
      }
    }
  }

  ngOnDestroy(): void {
    if (this.shadowDiv) {
      this.shadowDiv.remove();
    }
  }

  private link(element: HTMLElement): void {
    if (this.ngScrollable) {
      // Do something with this.ngScrollable
    }

    element.classList.add('ninth-gen');

    this.shadowDiv = document.createElement('div');
    if (element.scrollHeight !== 0) {
      this.shadowDiv.classList.add('shadow-bottom');
    }
    element.appendChild(this.shadowDiv);

    //this.scroller = new IScroll(element, {
    /*   this.scroller = new scroll(element, {
      bounce: this.bounce === 'true',
      disableMouse: this.disableMouse === 'true',
      disablePointer: this.disablePointer === 'true',
      disableTouch: this.disableTouch !== 'false',
      freeScroll: this.freeScroll === 'true',
      HWCompositing: this.hwCompositing === 'true',
      momentum: this.momentum !== 'false',
      mouseWheel: this.mouseWheel !== 'false',
      preventDefault: this.preventDefault !== 'false',
      probeType: this.probeType ? parseInt(this.probeType, 10) : 1,
      scrollbars: 'custom',
      scrollX: this.scrollX === 'true',
      scrollY: this.scrollY !== 'false',
      tap: this.tap !== 'false',
      useTransform: this.useTransform !== 'false',
      useTransition: this.useTransition === 'true',
    }); */

    this.scroller.on('scrollStart', () => {
      if (this.scroller.maxScrollY !== 0) {
        this.shadowDiv!.classList.add('shadow-bottom');
        this.shadowDiv!.classList.add('shadow-top');
      }
    });

    this.scroller.on('scrollEnd', () => {
      if (this.scroller.maxScrollY !== 0) {
        if (this.scroller.y === this.scroller.maxScrollY) {
          this.shadowDiv!.classList.remove('shadow-bottom');
        }
        if (this.scroller.y === 0) {
          this.shadowDiv!.classList.remove('shadow-top');
        }
      }

      if (this.scroller.y === this.scroller.maxScrollY && this.$scrollEnd && this.scroller.y !== this.currentY) {
        // Do something with this.$scrollEnd
      }

      this.currentY = this.scroller.y;
    });

    if (this.ngScrollable && this.ngScrollable.watchHeight) {
      // Do something with this.ngScrollable.watchHeight
    }

    element.style.position = 'relative';
    element.classList.add('wrapper');
  }
}
