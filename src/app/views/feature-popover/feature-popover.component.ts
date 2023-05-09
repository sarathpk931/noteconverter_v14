import { Component, OnInit, Output,EventEmitter } from '@angular/core';
//import { BsModalRef } from 'ngx-bootstrap/modal';
import { MatDialog, MatDialogRef } from '@angular/material/dialog'

import { ScanOptionsService} from '../../services/scan-options.service';
import { ModalService} from '../../services/modal.service';
import {FileFormat, FileFormatOption} from '../../model/global';
//import { EventEmitter } from 'stream';

@Component({
  selector: 'app-feature-popover',
  templateUrl: './feature-popover.component.html',
  styleUrls: ['./feature-popover.component.scss']
})
export class FeaturePopoverComponent implements OnInit {

    fileFormat : FileFormat;
    fileFormatOption : FileFormatOption[];
    from : string;
    @Output() objectSelected = new EventEmitter<any>();
        

    constructor(
                private scanOptionsService : ScanOptionsService, 
                private modalService : ModalService,
                public mtModalRef : MatDialogRef<any>
              )
              {}

    ngOnInit(){
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
