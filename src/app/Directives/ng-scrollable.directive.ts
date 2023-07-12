import { Directive, ElementRef,NgModule, Input, OnInit, OnDestroy,NgZone,Optional } from '@angular/core';
import { merge, Observable,fromEvent, interval, Subscription } from 'rxjs';
import { debounce } from 'rxjs/operators';
import {AppModule} from '../app.module';
import { IscrollModule,IScroll,IscrollDirective } from 'angular-iscroll-probe';
import {  } from 'iscroll';

@Directive({
  selector: '[ngScrollable]'
})


  export class NgScrollableDirective implements OnInit, OnDestroy {

    @Input() bounce: string | undefined;
    @Input() disableMouse: string | undefined;
    @Input() disablePointer: string | undefined;
    @Input() disableTouch: string | undefined;
    @Input() freeScroll: string | undefined;
    @Input() hwCompositing: string | undefined;
    @Input() momentum: string | undefined;
    @Input() mouseWheel: string | undefined;
    @Input() preventDefault: string | undefined;
    @Input() probeType: string | undefined;
    @Input() scrollbars: string | undefined;
    @Input() scrollX: string | undefined;
    @Input() scrollY: string | undefined;
    @Input() tap: string | undefined;
    @Input() useTransform: string | undefined;
    @Input() useTransition: string | undefined;

    private $$config: any;
    private $scrollEnd:any;
    private $$shadowDiv:any;

    private scroller: IScroll;
    private currentY: number = 0;
    private resizeSubscription: Subscription | undefined;
    private device :boolean=true;

    constructor(private elementRef: ElementRef) { }
   
    ngOnInit(): void {
      const element = this.elementRef.nativeElement as HTMLElement;

      
      // Check if scrollY attribute is not set to 'false'
      //const scrollY = element.getAttribute('scrollY');
      //if (!this.disableTouch || this.disableTouch !== 'false'){
      if (this.scrollY !== 'false') {

        alert("scrollY:" +this.scrollY);

        element.style.overflowY = 'auto';
        element.style.position = 'relative';

        const shadowDiv = document.createElement('div');
        shadowDiv.classList.add('shadow');
        shadowDiv.style.position = 'fixed';
        element.appendChild(shadowDiv);
        //this.$$shadowDiv = shadowDiv;


        // Do this in a timeout so that content can finish loading
        setTimeout(() => {
          // Determine location of shadow based on position of scrollable content
          alert("set time out");
          const offSet = element.getBoundingClientRect();
          const borderTop = parseInt(getComputedStyle(element).borderTopWidth  || '0', 10);
          const borderLeft = parseInt(getComputedStyle(element).borderLeftWidth  || '0', 10);

          shadowDiv.style.top = `${offSet.top + borderTop}px`;
          shadowDiv.style.left = `${offSet.left + borderLeft}px`;
          shadowDiv.style.height = `${element.clientHeight}px`;
          shadowDiv.style.width = `${element.clientWidth}px`;

          if (element.scrollHeight > element.clientHeight) {
            shadowDiv.classList.add('shadow-bottom');
          }
        }, 500);

          /* fromEvent(element, 'scroll').pipe(debounce(() => interval(100)))
          .subscribe(() => { */
          element.addEventListener('scroll', () =>{
            alert("Event Listener ")
            const movingHeight = element.firstElementChild?.clientHeight ||0;
            const scrollTop = element.scrollTop;
            const scrollableHeight = element.clientHeight;
            const delta = movingHeight - scrollableHeight;
            const atBottom = scrollTop >= delta;

            // Adjust width so we don't have shadows on the scrollbar
            this.$$shadowDiv.style.width = `${element.clientWidth}px`;
            this.$$shadowDiv.style.width = `${element.clientHeight}px`;
            
            if (atBottom) {
              this.$$shadowDiv.classList.remove('shadow-bottom');
            } else {
              this.$$shadowDiv.classList.add('shadow-bottom');
            }

            if (scrollTop === 0) {
              this.$$shadowDiv.classList.remove('shadow-top');
            } else {
              this.$$shadowDiv.classList.add('shadow-top');
            }
          });
      
      
      
        this.scroller = new IScroll(element, {
          
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
        });

        alert("scroller opriones initiated:"+ this.scroller);

        this.$$shadowDiv = document.createElement('div');
        this.$$shadowDiv.classList.add('shadow');
        element.appendChild(this.$$shadowDiv);

        if (this.scroller.maxScrollY !== 0) {
          this.$$shadowDiv.classList.add('shadow-bottom');
          alert("maxScrollY:" +this.scroller.maxScrollY);
        }

        this.scroller.on('scrollStart', () => {
          if (this.scroller.maxScrollY !== 0) {
            this.$$shadowDiv.classList.add('shadow-bottom');
            this.$$shadowDiv.classList.add('shadow-top');
          }
        });

        this.scroller.on('scrollEnd', () => {
          if (this.scroller.maxScrollY !== 0) {
            if (this.scroller.y === this.scroller.maxScrollY) {
              this.$$shadowDiv.classList.remove('shadow-bottom');
            }
            if (this.scroller.y === 0) {
              this.$$shadowDiv.classList.remove('shadow-top');
            }
          }

          if (this.scroller.y === this.scroller.maxScrollY && this.$scrollEnd && this.scroller.y !== this.currentY) {
            this.$apply(() => {
              this.$scrollEnd(this);
            });
          }
    
          this.currentY = this.scroller.y;
        });

        /* this.resizeSubscription = fromEvent(window, 'resize').pipe(debounce(() => interval(100)))
        .subscribe(() => {
          this.updateViewport();
          this.scroller.refresh();

          if (this.scroller.maxScrollY !== 0) {
            this.$$shadowDiv.classList.add('shadow-bottom');
          } else {
            this.$$shadowDiv.classList.remove('shadow-bottom');
          }

          if (this.scroller.y === 0) {
            this.$$shadowDiv.classList.remove('shadow-top');
          }
        }); */

      }
    
    }
  

    ngOnDestroy(): void {
      if (this.resizeSubscription) {
        this.resizeSubscription.unsubscribe();
      }
    }

    private updateViewport(): void {
      const element = this.elementRef.nativeElement as HTMLElement;
  
      if (this.$$config && this.$$config.autoHeight) {
        const padding = this.$$config.padding || 0;
        element.style.height = `${(window.innerHeight - element.offsetTop) - padding}px`;
      }
    }

    private $apply(callback: Function) {
      // Implement the $apply method for Angular's change detection
      // Replace this with your actual implementation
      callback();
    }
  
  }
  
  

 