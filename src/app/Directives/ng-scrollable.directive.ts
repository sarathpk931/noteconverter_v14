import { Directive, ElementRef,NgModule, Input, OnInit, OnDestroy,NgZone,Optional } from '@angular/core';
//import {ScrollingModule ,CdkScrollable, ScrollDispatcher } from '@angular/cdk/scrolling';
//import { Directionality } from '@angular/cdk/bidi';
//import { merge, Observable } from 'rxjs';
import {AppModule} from '../app.module';
//import  from 'iscroll';

@Directive({
  selector: '[ngScrollable]'
})


  export class NgScrollableDirective implements OnInit {

    constructor(private elementRef: ElementRef) { }
   
    ngOnInit(): void {
      const element = this.elementRef.nativeElement;
      // Check if scrollY attribute is not set to 'false'
      const scrollY = element.getAttribute('scrollY');
      if (scrollY !== 'false') {
        element.style.overflowY = 'auto';
        element.style.position = 'relative';

        const shadowDiv = document.createElement('div');
        shadowDiv.className = 'shadow';
        shadowDiv.style.position = 'fixed';
        element.appendChild(shadowDiv);

        // Do this in a timeout so that content can finish loading
        setTimeout(() => {
          // Determine location of shadow based on position of scrollable content
          const offSet = element.getBoundingClientRect();
          const borderTop = parseInt(getComputedStyle(element).borderTopWidth, 10);
          const borderLeft = parseInt(getComputedStyle(element).borderLeftWidth, 10);

          shadowDiv.style.top = `${offSet.top + borderTop}px`;
          shadowDiv.style.left = `${offSet.left + borderLeft}px`;
          shadowDiv.style.height = `${element.clientHeight}px`;
          shadowDiv.style.width = `${element.clientWidth}px`;

          if (element.scrollHeight > element.clientHeight) {
            shadowDiv.classList.add('shadow-bottom');
          }
        }, 500);

        element.addEventListener('scroll', () => {
          const movingHeight = element.firstElementChild.clientHeight;
          const scrollTop = element.scrollTop;
          const scrollableHeight = element.clientHeight;
          const delta = movingHeight - scrollableHeight;
          const atBottom = scrollTop >= delta;

          // Adjust width so we don't have shadows on the scrollbar
          shadowDiv.style.width = `${element.clientWidth}px`;
          shadowDiv.style.height = `${element.clientHeight}px`;
          
          if (atBottom) {
            shadowDiv.classList.remove('shadow-bottom');
          } else {
            shadowDiv.classList.add('shadow-bottom');
          }

          if (scrollTop === 0) {
            shadowDiv.classList.remove('shadow-top');
          } else {
            shadowDiv.classList.add('shadow-top');
          }
        });
      }
    }
  }
  
  

 