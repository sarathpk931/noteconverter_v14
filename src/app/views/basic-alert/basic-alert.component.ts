import { Component,Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ModalService} from '../../services/modal.service';
import {DialogData} from '../../model/global';

@Component({
  selector: 'app-basic-alert',
  templateUrl: './basic-alert.component.html',
  styleUrls: ['./basic-alert.component.scss']
})


export class BasicAlertComponent {


  constructor(
    private modalService : ModalService,
    public mtModalRef : MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data : DialogData
  )
  {}

  ngOnInit(){


  }

  closeModal():void{
    this.modalService.closeModal(this.mtModalRef);
  }
}
