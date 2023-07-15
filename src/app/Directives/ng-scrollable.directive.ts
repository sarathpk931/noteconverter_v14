import { Directive, ElementRef,NgModule, Input, OnInit, OnDestroy,HostListener,ContentChild  } from '@angular/core';
import { merge, Observable,fromEvent, interval, Subscription } from 'rxjs';
import { debounce } from 'rxjs/operators';
import {AppModule} from '../app.module';
import { ModalService } from '../services/modal.service';

declare const IScroll: any; 



@Directive({
  selector: '[ngScrollable]'
})


  export class NgScrollableDirective implements OnDestroy {

    @ContentChild('scrollableContent') scrollableContent!: ElementRef<HTMLElement>;

    @Input() ngScrollable: any | undefined;
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
    @Input() isPopupOpen: boolean;
    @Input() autoHeight: boolean;
    @Input() watchHeight: boolean;

    private $$config: any;
    private $scrollEnd:any;
    private shadowDiv: HTMLDivElement | null;
    private wrapperHeight: number;
    private windowHeight: number;
    private heightWatcher: any;


    private scroller: any;
    private currentY: number = 0;
    private isThirdGenBrowser :boolean;
    private generation :number ;


    constructor(private elementRef: ElementRef, private modalService:ModalService) { }
  

    ngAfterViewInit(): void {

      const element = this.elementRef.nativeElement as HTMLElement;
      this.wrapperHeight = element.offsetHeight;
      this.windowHeight = window.innerHeight;
      
      this.isThirdGenBrowser=AppModule.isThirdGenBrowser;
      this.generation=AppModule.Generation;
      
      if (!AppModule.isThirdGenBrowser && AppModule.Generation >= 7.0){
        this.link(element);
        //alert("Inside If");
      } 
      else
      {
        if (this.scrollY !== 'false') {

        element.style.overflowY = 'auto';
        element.style.position = 'relative';

        const shadowDiv = document.createElement('div');
        shadowDiv.classList.add('shadow');
        shadowDiv.style.position = 'fixed';
        element.appendChild(shadowDiv);
        this.shadowDiv = shadowDiv;


        // Do this in a timeout so that content can finish loading
        setTimeout(() => {
          // Determine location of shadow based on position of scrollable content
         
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

         
          element.addEventListener('scroll', () =>{
            
            const movingHeight = element.firstElementChild?.clientHeight ||0;
            const scrollTop = element.scrollTop;
            const scrollableHeight = element.clientHeight;
            const delta = movingHeight - scrollableHeight;
            const atBottom = scrollTop >= delta;

            // Adjust width so we don't have shadows on the scrollbar
            this.shadowDiv.style.width = `${element.clientWidth}px`;
            this.shadowDiv.style.width = `${element.clientHeight}px`;
            
            if (atBottom) {
              this.shadowDiv.classList.remove('shadow-bottom');
            } else {
              this.shadowDiv.classList.add('shadow-bottom');
            }

            if (scrollTop === 0) {
              this.shadowDiv.classList.remove('shadow-top');
            } else {
              this.shadowDiv.classList.add('shadow-top');
            }
          });
      
      }
    
    
    }
  }

  ngOnDestroy(): void {
      this.stopHeightWatcher();
      if (this.shadowDiv) {
        this.shadowDiv.remove();
      }
    }

  private link(element: HTMLElement): void {
    
    if (this.ngScrollable) {
      const config = JSON.parse(this.ngScrollable);
      this.watchHeight=config.watchHeight;
      this.autoHeight=config.autoHeight;
      this.$$config = config;
      this.$scrollEnd = config.autoHeight;
    }
    console.log("element inner html" + element.innerHTML);

    element.classList.add('ninth-gen');

    this.wrapperHeight=element.offsetHeight;

    console.log("wrapper Height"+ this.wrapperHeight);

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

    this.shadowDiv = document.createElement('div');


    if (element.scrollHeight !== 0) {
      console.log("element.scrollHeight :" + element.scrollHeight);
      this.shadowDiv.classList.add('shadow-bottom');
    }
    element.appendChild(this.shadowDiv);

    console.log("element.scrollHeight :" + element.scrollHeight);
    console.log("this.scroller.maxScrollY :"+this.scroller.maxScrollY);
    console.log("this.scroller.y :"+this.scroller.y);
    console.log("this.$scrollEnd :"+this.$scrollEnd);
    console.log("this.currentY :"+this.currentY);
    
    this.scroller.on('scrollStart', () => {
    
      if (this.scroller.maxScrollY !== 0) {
        console.log("this.scroller.maxScrollY :" + this.scroller.maxScrollY);
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
        console.log("this.scroller.y :" +this.scroller.y);
        this.$scrollEnd(this);
      }

      this.currentY = this.scroller.y;
    });

    if (this.autoHeight && this.watchHeight) {
      console.log("this.ngScrollable && this.ngScrollable.watchHeight :" + this.ngScrollable && this.ngScrollable.watchHeight);
      this.startHeightWatcher();
    }

    element.style.position = 'relative';
    element.classList.add('wrapper');

    const scrollableContent = this.scrollableContent?.nativeElement;
    
    this.modalService.viewVisible.subscribe(() => {
      // Update the viewport when the view is visible
      this.updateViewport();
      if (this.scroller) {
        this.scroller.refresh();
        this.updateShadowDiv();
      }
    });

    if(scrollableContent) {
      const observer = new MutationObserver(() => {
        this.updateScrollableContent();
      });

      observer.observe(scrollableContent, { childList: true, subtree: true });

      this.updateScrollableContent();
    }
  }

  private updateScrollableContent(): void {
    const scrollableContent = this.scrollableContent?.nativeElement;
    if (this.scroller && scrollableContent) {
      this.scroller.refresh();
      this.updateShadowDiv();
    }

    if (scrollableContent) {
      const scrollableHeight = scrollableContent.scrollHeight;
      if (scrollableHeight !== 0) {
        this.shadowDiv.classList.add('shadow-bottom');
      } else {
        this.shadowDiv.classList.remove('shadow-bottom');
      }

      this.scroller.on('scrollStart', () => {
    
        if (this.scroller.maxScrollY !== 0) {
          console.log("this.scroller.maxScrollY :" + this.scroller.maxScrollY);
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
          console.log("this.scroller.y :" +this.scroller.y);
          this.$scrollEnd(this);
        }
  
        this.currentY = this.scroller.y;
      });
    }
  
  }

  private startHeightWatcher(): void {

    this.stopHeightWatcher(); // Ensure previous interval is cleared
    this.heightWatcher = setInterval(() => {
      const currentHeight = this.elementRef.nativeElement.offsetHeight;
      const currentWindowHeight = window.innerHeight;

      if (currentHeight !== this.wrapperHeight || currentWindowHeight !== this.windowHeight) {
        this.wrapperHeight = currentHeight;
        this.windowHeight = currentWindowHeight;
        this.updateViewport();
        if (this.scroller) {
          this.scroller.refresh();
          this.updateShadowDiv();
        }
      }
    }, 100);
  }

  private stopHeightWatcher(): void {
    if (this.heightWatcher) {
      clearInterval(this.heightWatcher);
      this.heightWatcher = undefined;
    }
  }

  private updateViewport(): void {
    // Perform viewport update logic here
    const element = this.elementRef.nativeElement as HTMLElement;
    if (this.$$config && this.$$config.autoHeight) {
      const padding = this.$$config.padding || 0;
      element.style.height = `${(window.innerHeight - element.offsetTop) - padding}px`;
    }
  }

  @HostListener('window:resize')
  private onWindowResize(): void {
    this.windowHeight = window.innerHeight;
    this.updateViewport();
    if (this.scroller) {
      this.scroller.refresh();
      this.updateShadowDiv();
    }
  }

  private updateShadowDiv(): void {
    if (this.shadowDiv) {
      if (this.scroller && this.scroller.maxScrollY !== 0) {
        this.shadowDiv.classList.add('shadow-bottom');
      } else {
        this.shadowDiv.classList.remove('shadow-bottom');
      }
    }
  }
}
