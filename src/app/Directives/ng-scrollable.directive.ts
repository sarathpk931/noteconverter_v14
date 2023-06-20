import { Directive, ElementRef,NgModule, Input, OnInit, OnDestroy,NgZone,Optional } from '@angular/core';
//import {ScrollingModule ,CdkScrollable, ScrollDispatcher } from '@angular/cdk/scrolling';
//import { Directionality } from '@angular/cdk/bidi';
//import { merge, Observable } from 'rxjs';
import {AppModule} from '../app.module';
//import  from 'iscroll';

@Directive({
  selector: '[ngScrollable]'
})

//export class NgScrollableDirective extends CdkScrollable {
  export class NgScrollableDirective  {}
  /* constructor ( elementRef: ElementRef<HTMLElement>, scrollDispatcher: ScrollDispatcher,ngZone: NgZone,@Optional() dir?: Directionality) {

    super(elementRef, scrollDispatcher, ngZone, dir);
    this.scrollingSubscription = this.scrollDispatcher
          .scrolled()
          .subscribe((data: CdkScrollable) => {
            this.onWindowScroll(data);
          });
    

    
  }

  ngAfterViewInit() {
    this.scrollDispatcher.scrollContainers.forEach((key, value ) => {
      console.log(value.getElementRef['scroll-container']);
    })
  }

  get element(): HTMLElement {
    return this.elementRef.nativeElement;
  }
 */
  /* ngOnDestroy() {
    this.scrollDispatcher.deregister(this);
  } */

  /* private onWindowScroll(data: CdkScrollable) {
    const scrollTop = data.getElementRef().nativeElement.scrollTop || 0;
    if (this.lastOffset > scrollTop) {
      // console.log('Show toolbar');
    } else if (scrollTop < 10) {
      // console.log('Show toolbar');
    } else if (scrollTop > 100) {
      // console.log('Hide toolbar');
    }

    this.lastOffset = scrollTop;
  } */

  //*************************************
//export class NgScrollableDirective { //implements OnInit, OnDestroy
  
 /*  private $scrollEnd: any;

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
  private $heightWatcher: any;
  private $$config :any;
  private $wrapperHeight:any;
  private windowHeight:any;
  private $windowHeight:any;
  private shadowDiv: HTMLDivElement | null;
  private $$localPopoverId:any;
  private $viewVisible:any;

  constructor(
    private elementRef: ElementRef,
    private ngZone: NgZone
    ) { }

  ngOnInit(): void {
    const element = this.elementRef.nativeElement as HTMLElement;
    
    const deviceisThirdGenBrowser =AppModule.isThirdGenBrowser;
    const deviceGeneration=AppModule.Generation;
    const isThirdGenBrowser=false;
    const Generation= 7;

    //if (!AppModule.isThirdGenBrowser && AppModule.Generation >= 9.0 ) {
    if (!isThirdGenBrowser && Generation >= 9.0 ) {
      console.log("if condition");
      console.log(deviceisThirdGenBrowser);console.log(deviceisThirdGenBrowser);
      
      this.link();
     
    } else {
      console.log("else condition")
      if (this.scrollY !== 'false') {
        element.style.overflowY = 'auto';
        element.style.position = 'relative';
        this.shadowDiv = document.createElement('div');
        this.shadowDiv.className = 'shadow';
        this.shadowDiv.style.position = 'fixed';
        element.appendChild(this.shadowDiv);

        this.ngZone.runOutsideAngular(()=>{
        setTimeout(() => {
          const offset = element.getBoundingClientRect();
          const borderTop = parseInt(getComputedStyle(element).borderTopWidth,10);
          const borderLeft = parseInt(getComputedStyle(element).borderLeftWidth, 10);

          this.shadowDiv.style.top = `${offset.top + borderTop}px`;
          this.shadowDiv.style.left = `${offset.left + borderLeft}px`;
          this.shadowDiv.style.height = `${element.clientHeight}px`;
          this.shadowDiv.style.width = `${element.clientWidth}px`;

          if (element.clientHeight < element.scrollHeight) {
            this.shadowDiv!.classList.add('shadow-bottom');
          }
        }, 500);
      });

        element.addEventListener('scroll', () => { alert("event scroll");
        this.ngZone.run(()=>{
          const movingHeight = element.children[0].clientHeight;
          const scrollTop = element.scrollTop;
          const scrollableHeight = element.clientHeight;
          const delta = movingHeight - scrollableHeight;
          const atBottom = scrollTop >= delta;

          this.shadowDiv.style.width = `${element.clientWidth}px`;
          this.shadowDiv.style.height = `${element.clientHeight}px`;

          if (atBottom) {
            this.shadowDiv.classList.remove('shadow-bottom');
          } else {
            this.shadowDiv.classList.add('shadow-bottom');
          }

          if (scrollTop === 0) {
            this.shadowDiv!.classList.remove('shadow-top');
          } else {
            this.shadowDiv!.classList.add('shadow-top');
          }
        });
      });
      }
    }
  }

  ngOnDestroy(): void {
    if (this.scroller) {
      this.scroller.destroy();
      this.scroller = undefined;
    }

    if (this.shadowDiv) {
      this.shadowDiv.remove();
      this.shadowDiv = undefined;
    }

    if (this.$heightWatcher) {
      clearInterval(this.$heightWatcher);
      this.$heightWatcher = undefined;
    }
  }

  private link()  {
    if (!!this.ngScrollable) {
      console.log("link function if condition");
      // Do something with this.ngScrollable
      this.$$config = this.ngScrollable;
      this.$scrollEnd = this.parse(this.$$config.scrollEnd);
      
    }

    console.log("link function ");
    const contentDiv = this.elementRef.nativeElement.classList.add('ninth-gen');

    this.$wrapperHeight = this.elementRef.nativeElement.offsetHeight;

    

    //this.scroller = new IScroll(element, {
      this.scroller = new IScroll(this.elementRef.nativeElement, {
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
    if (this.scroller.maxScrollY !== 0) {
      this.shadowDiv.classList.add('shadow-bottom');
    }
    this.elementRef.nativeElement.appendChild(this.shadowDiv);

    this.scroller.on('scrollStart', () => {
      if (this.scroller.maxScrollY !== 0) {
        this.shadowDiv.classList.add('shadow-bottom');
        this.shadowDiv.classList.add('shadow-top');
      }
    });

    this.scroller.on('scrollEnd', () => {
      if (this.scroller.maxScrollY !== 0) {
        if (this.scroller.y === this.scroller.maxScrollY) {
          this.shadowDiv.classList.remove('shadow-bottom');
        }
        if (this.scroller.y === 0) {
          this.shadowDiv!.classList.remove('shadow-top');
        }
      }

      if (this.scroller.y === this.scroller.maxScrollY && this.$scrollEnd && this.scroller.y !== this.currentY) {
        // Do something with this.$scrollEnd
        this.ngZone.run(() => {
          this.$scrollEnd(this);
        });
      }

      this.currentY = this.scroller.y;
    });

    if (this.ngScrollable && this.ngScrollable.watchHeight) {
      // Do something with this.ngScrollable.watchHeight
      this.$heightWatcher = setInterval(() => {
        const currentHeight = this.elementRef.nativeElement.children[0].clientHeight;
        const windowHeight = window.innerHeight;

        if (currentHeight !== this.$wrapperHeight || windowHeight !== this.$windowHeight) {
          this.updateViewport();
          this.scroller.refresh();

          if (this.scroller.maxScrollY !== 0) {
            this.shadowDiv.classList.add('shadow-bottom');
          } else {
            this.shadowDiv.classList.remove('shadow-bottom');
          }

          if (this.scroller.y === 0) {
            this.shadowDiv.classList.remove('shadow-top');
          }

          if (currentHeight !== this.$wrapperHeight) {
            this.$wrapperHeight = currentHeight;
          }

          if (windowHeight !== this.$windowHeight) {
            this.$windowHeight = windowHeight;
          }
        }
      }, 100);
    }

    
    this.$$localPopoverId = this.elementRef.nativeElement.closest('popover').id;
    
    this.elementRef.nativeElement.style.position = 'relative';
    this.elementRef.nativeElement.classList.add('wrapper');

    this.$viewVisible = this.$viewVisible.subscribe(() => {
      this.ngZone.run(() => {
        this.updateViewport();
        this.scroller.refresh();
      });
    });


  }

  private updateViewport() {
    const offset = this.elementRef.nativeElement.getBoundingClientRect();
    const borderTop = parseInt(getComputedStyle(this.elementRef.nativeElement).borderTopWidth, 10);
    const borderLeft = parseInt(getComputedStyle(this.elementRef.nativeElement).borderLeftWidth, 10);

    this.shadowDiv.style.top = `${offset.top + borderTop}px`;
    this.shadowDiv.style.left = `${offset.left + borderLeft}px`;
    this.shadowDiv.style.height = `${this.elementRef.nativeElement.clientHeight}px`;
    this.shadowDiv.style.width = `${this.elementRef.nativeElement.clientWidth}px`;
  }

  private parse(expression: string) {
    if (!expression) {
      return undefined;
    }

    const func = expression.match(/^(.+)\((.+)\)$/);
    if (func) {
      const params = func[2].split(',');
      for (let i = 0; i < params.length; i++) {
        params[i] = params[i].trim();
      }
      return (window as any)[func[1]].apply(null, params);
    }

    return (window as any)[expression];
  } */

