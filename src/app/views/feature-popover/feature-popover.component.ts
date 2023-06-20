import { Component, OnInit,Input, Output,EventEmitter } from '@angular/core';
import {  MatDialogRef } from '@angular/material/dialog'
import { ElementRef, Renderer2 } from '@angular/core';
import { ScanOptionsService} from '../../services/scan-options.service';
import { ModalService} from '../../services/modal.service';
import { ResourcestringService} from '../../services/resourcestring.service';
import {FileFormat, FileFormatOption,resourceString} from '../../model/global';

@Component({
  selector: 'app-feature-popover',
  templateUrl: './feature-popover.component.html',
  styleUrls: ['./feature-popover.component.less']
})
export class FeaturePopoverComponent implements OnInit {

    fileFormat : FileFormat;
    fileFormatOption : FileFormatOption[];
    from : string;
    resourceString : resourceString[];
    scrollBarsFixed = false;
    @Output() objectSelected = new EventEmitter<any>();
    @Input() feature: any;
    @Input() event: MouseEvent;
        

    constructor(
                private scanOptionsService : ScanOptionsService, 
                private modalService : ModalService,
                private resourceStringService : ResourcestringService,
                public mtModalRef : MatDialogRef<any>,
                private elementRef: ElementRef,
                private renderer: Renderer2
              )
              {}

    ngOnInit(){
      this.resourceString = this.resourceStringService.getObjStrings();

      this.modalService.currentValue.subscribe((data) =>{
        this.from = data;
      });
      this.fileFormat = this.scanOptionsService.getFileFormat(this.from);
      this.fileFormatOption = this.fileFormat.options;
      

    }

    

    selectOption(option : any){
      this.scanOptionsService.setSelectedOption(option,this.from);
      this.objectSelected.emit(option);
      this.modalService.closeModal(this.mtModalRef);
      this.showPopover();
    }

    closeModal():void{
      this.modalService.closeModal(this.mtModalRef);
    }
    
    showPopover() {
      const name = this.feature.name;
      const options: any = {}; 
  
    
      this.showPopoverHelper(this.event, name, options);
    }
    
    showPopoverHelper(e: MouseEvent, name: string, options: any): void {
      const winHeight = window.innerHeight;
      const winWidth = window.innerWidth;

      const popover = this.elementRef.nativeElement.querySelector(`#${name}`);
      const contents = this.elementRef.nativeElement.querySelector(`#${name} div.contents`);

      const popoverModal = popover.closest('.modal-dialog');

      const arrow = popover.querySelector('.arrow');
      const arrowContents = arrow.querySelector('*');

      this.renderer.setStyle(contents, 'position', 'fixed');
      this.renderer.setStyle(contents, 'z-index', '1');
      this.renderer.setStyle(contents, 'display', 'none');

      this.renderer.setStyle(popoverModal, 'width', 'initial');
      this.renderer.setStyle(popoverModal, 'height', 'initial');

      const height = contents.dataset.height || contents.offsetHeight;
      const width = contents.offsetWidth;
      const padding = contents.clientWidth - width;

      contents.dataset.height = height.toString();

      let top = Math.max(2, e.pageY - height / 2);
      top = Math.max(8, top);

      if (options && options.top !== undefined) {
        top = options.top;
      }

      const totalSize = width + padding + arrow.offsetWidth;
      const availableSpaceOnRight = winWidth - e.pageX;
      const availableSpaceOnLeft = winWidth - availableSpaceOnRight;

      let calcLeft = e.pageX - totalSize;
      let showArrow = true;

      let arrowLeft = 0;
      let float = 'left';
      let transform = 'none';

      if (totalSize < availableSpaceOnRight) {
        calcLeft = e.pageX + arrow.offsetWidth;
        arrowLeft = e.pageX;
        float = 'right';
      } else if (totalSize < availableSpaceOnLeft) {
        arrowLeft = e.pageX - arrow.offsetWidth;
      } else {
        calcLeft = (winWidth - totalSize) / 2;
        arrowLeft = e.pageX - arrow.offsetWidth / 2;
        transform = 'rotate(270deg)';
        showArrow = false;
      }

      if (showArrow) {
        this.renderer.setStyle(arrow, 'left', arrowLeft + 'px');
        this.renderer.setStyle(arrow, 'top', e.pageY - arrow.offsetHeight / 2 + 'px');
        this.renderer.setStyle(arrow, 'z-index', '1300');
        this.renderer.setStyle(arrow, 'transform', transform);
        this.renderer.setStyle(arrowContents, 'float', float);
        this.renderer.removeStyle(arrow, 'display');
      } else {
        this.renderer.setStyle(arrow, 'display', 'none');
      }

      let adjustedTop = top;
      if (top + contents.offsetHeight + 16 >= winHeight) {
        const diff = winHeight - (top + contents.offsetHeight);
        adjustedTop = top - Math.abs(diff) - 24;
      }

      if (adjustedTop < 0) {
        this.renderer.setStyle(contents, 'left', calcLeft + 'px');
        this.renderer.setStyle(contents, 'display', 'block');
        this.renderer.setStyle(contents, 'bottom', '8px');
        this.renderer.setStyle(contents, 'max-height', '584px');
      } else {
        this.renderer.setStyle(contents, 'left', calcLeft + 'px');
        this.renderer.setStyle(contents, 'display', 'block');
        this.renderer.setStyle(contents, 'top', adjustedTop + 'px');
        this.renderer.setStyle(contents, 'max-height', '584px');
        this.renderer.removeStyle(contents, 'bottom');
      }

      const fixScrollBars = (): void => {
        if (!this.scrollBarsFixed) {
          const scrollContent = this.elementRef.nativeElement.querySelector(`#${name} div.popover-scroll-content`);
          const scrollChild = this.elementRef.nativeElement.querySelector(`#${name} div.popover-scroll-content ul.action-list`);
          const buttons = this.elementRef.nativeElement.querySelectorAll(`#${name} div.popover-scroll-content ul.action-list button`);

          const scrollContentWidth = scrollContent.offsetWidth - 2;
          const scrollContentInnerWidth = buttons[0].scrollWidth;
          const scrollContentHeight = scrollContent.offsetHeight;
          const scrollContentInnerHeight = scrollChild.offsetHeight;

          if (
            (scrollContentWidth === scrollContentInnerWidth && scrollContentHeight !== scrollContentInnerHeight) ||
            scrollContentWidth < scrollContentInnerWidth
          ) {
            buttons.forEach((button: HTMLElement) => {
              this.renderer.setStyle(button, 'margin-right', '50px');
            });
            this.scrollBarsFixed = true;
          }
        }

        const newWidth = contents.offsetWidth;
        if (float === 'left' && calcLeft + newWidth + padding !== arrowLeft) {
          calcLeft = arrowLeft - newWidth - padding;
          this.renderer.setStyle(contents, 'left', calcLeft + 'px');
        }
      };

      fixScrollBars();

      const images = popover.querySelectorAll('.image');
      images.forEach((image: HTMLImageElement) => {
        image.addEventListener('load', fixScrollBars);
      });

      setTimeout(fixScrollBars, 500);
        }

    
}
