import { Component,Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ModalService} from '../../services/modal.service';
import {DialogData} from '../../model/global';
import {AppModule} from '../../app.module';


@Component({
  selector: 'app-progress-alert',
  templateUrl: './progress-alert.component.html',
  styleUrls: ['./progress-alert.component.less']
})
export class ProgressAlertComponent {
  generation = AppModule.Generation;
  isThirdGenBrowser = AppModule.isThirdGenBrowser;

  constructor(
    private modalService : ModalService,
    public mtModalRef : MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data : DialogData
  )
  {}

  ngOnInit(){
    
   //alert("Progress alert :"+ this.isThirdGenBrowser);
  }
}
