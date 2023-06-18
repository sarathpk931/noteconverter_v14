import { Component, OnInit, Output,EventEmitter } from '@angular/core';
import {  MatDialogRef } from '@angular/material/dialog'

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
    @Output() objectSelected = new EventEmitter<any>();
        

    constructor(
                private scanOptionsService : ScanOptionsService, 
                private modalService : ModalService,
                private resourceStringService : ResourcestringService,
                public mtModalRef : MatDialogRef<any>
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
    }

    closeModal():void{
      this.modalService.closeModal(this.mtModalRef);
    }
    
}
