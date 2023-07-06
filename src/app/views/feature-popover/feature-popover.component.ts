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

  //arrowSegments: number[] = Array.from({ length: 12 });

    fileFormat : FileFormat;
    fileFormatOption : FileFormatOption[];
    from : any;
    resourceString : resourceString[];
    scrollBarsFixed = false;

    @Output() objectSelected = new EventEmitter<any>();
    @Input() feature: any;
    @Input() event: MouseEvent;

    const_fileFormat : string = "fileFormat";
    const_type : string = "type";
    const_size : string = 'size';
    selectedFileFormat : FileFormat;
    selectedType : FileFormat;
    selectedSize : FileFormat;
    anyFileFormat = {from : 'fileFormat'};
    anyType = {from : 'type'};
    anySize = {from : 'size'};
    selectedFileFormatOption: FileFormatOption;
    selectedTypeOption: FileFormatOption;
    selectedSizeOption: FileFormatOption; 
    selectedOption : FileFormatOption;

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

      if(this.from.from == this.const_fileFormat)
      {
        this.selectedFileFormat = this.scanOptionsService.getFileFormat(this.anyFileFormat);
        this.selectedFileFormatOption = this.selectedFileFormat.options.find(item => item.isDefault === true);
      }
      else if (this.from.from == this.const_type){
        this.selectedType = this.scanOptionsService.getFileFormat(this.anyType);
       this.selectedTypeOption = this.selectedType.options.find(item => item.isDefault === true);
      }
      else if (this.from.from == this.const_size){
        this.selectedSize = this.scanOptionsService.getFileFormat(this.anySize);
        this.selectedSizeOption = this.selectedSize.options.find(item => item.isDefault === true);
      }
      
      this.scanOptionsService.selectedFileFormatC.subscribe(object =>{
        if(object){
          this.selectedFileFormatOption = object;
          
        }
      })

      this.scanOptionsService.selectedTypeC.subscribe(type =>{
        if(type){
          this.selectedTypeOption = type;
        }
      })

      this.scanOptionsService.selectedSizeC.subscribe(size =>{
        if(size){
          this.selectedSizeOption = size;
        }
      })
    }

    //default selection
    getNgClass(option: any): any{

      if(this.from.from == this.const_fileFormat)
        {
          return { selected : option === this.selectedFileFormatOption };
        }
        else if (this.from.from == this.const_type){
          return { selected : option === this.selectedTypeOption };
        }
        else if (this.from.from == this.const_size){
          return { selected : option === this.selectedSizeOption};
        }
      return ;
    }

    //when an option is selected
    selectOption(option : any){
      this.selectOption = option;
      this.scanOptionsService.setSelectedOption(option,this.from);
      this.objectSelected.emit(option);
      // this.modalService.closeModal(this.mtModalRef);
      
      document.querySelector('.cdk-overlay-backdrop-showing').classList.add('cdk-overlay-backdrop-hide');
      this.showPopover();
    }

    closeModal():void{
      this.modalService.closeModal(this.mtModalRef);
    }
    
    showPopover() {
      const name = this.feature.name;
      const options: any = {}; 
  
      
      this.showPopoverHelper(this.event, options);
    }
    
    showPopoverHelper(e: MouseEvent,options: any): void {
      const winHeight = window.innerHeight;
      const winWidth = window.innerWidth;

      const popover = this.elementRef.nativeElement.querySelector('.popover');
      const rect=popover.getBoundingClientRect();
      console.log("popover native element top" + rect.top);
      console.log("popover native element height" + rect.height);
      console.log("popover native element width" + rect.width);
      console.log("popover native element left" + rect.left);

      //const popover = this.elementRef.nativeElement.querySelector(`.popover`);
      const contents = popover.querySelector(`.contents`);
      console.log("contents" + contents);

      //const popoverModal = popover.closest('.cdk-overlay-container');
      //console.log("popoverModal" + popoverModal);

      //const arrow = popover.querySelector('.arrow');
      //const arrowContents = arrow.querySelector('arrow-segment');

      this.renderer.setStyle(contents, 'position', 'fixed');
      this.renderer.setStyle(contents, 'z-index', '1');
      this.renderer.setStyle(contents, 'display', 'none');

      //this.renderer.setStyle(popoverModal, 'width', 'initial');
      //this.renderer.setStyle(popoverModal, 'height', 'initial');

      const height = contents.dataset.height || contents.offsetHeight;
      const width = contents.offsetWidth;
      const padding = contents.clientWidth - width;

      contents.dataset.height = height.toString();

      let top = Math.max(2, e.pageY - height / 2);
      top = Math.max(8, top);

      if (options && options.top !== undefined) {
        top = options.top;
      }

      const totalSize = width + padding + rect.offsetWidth;
      const availableSpaceOnRight = winWidth - e.pageX;
      const availableSpaceOnLeft = winWidth - availableSpaceOnRight;

      let calcLeft = e.pageX - totalSize;
      let showArrow = true;

      let arrowLeft = 0;
      let float = 'left';
      let transform = 'none';

      if (totalSize < availableSpaceOnRight) {
        calcLeft = e.pageX + rect.offsetWidth;
        arrowLeft = e.pageX;
        float = 'right';
      } else if (totalSize < availableSpaceOnLeft) {
        arrowLeft = e.pageX - rect.offsetWidth;
      } else {
        calcLeft = (winWidth - totalSize) / 2;
        arrowLeft = e.pageX - rect.offsetWidth / 2;
        transform = 'rotate(270deg)';
        showArrow = false;
      }

      if (showArrow) {
        this.renderer.setStyle(rect, 'left', arrowLeft + 'px');
        this.renderer.setStyle(rect, 'top', e.pageY - rect.offsetHeight / 2 + 'px');
        this.renderer.setStyle(rect, 'z-index', '1300');
        this.renderer.setStyle(rect, 'transform', transform);
        this.renderer.setStyle(contents, 'float', float);
        this.renderer.removeStyle(rect, 'display');
      } else {
        this.renderer.setStyle(rect, 'display', 'none');
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
          const scrollContent = this.elementRef.nativeElement.querySelector(`popover-scroll-content`);
          const scrollChild = this.elementRef.nativeElement.querySelector(`popover-scroll-content ul.action-list`);
          const buttons = this.elementRef.nativeElement.querySelectorAll(`popover-scroll-content ul.action-list button`);

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
