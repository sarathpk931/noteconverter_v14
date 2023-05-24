import { Component } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ModalService} from '../../services/modal.service';

@Component({
  selector: 'app-basic-alert',
  templateUrl: './basic-alert.component.html',
  styleUrls: ['./basic-alert.component.scss']
})

// export interface DialogData {
//   title: string;
//   message: string;
// }
export class BasicAlertComponent {

  title : string;
  message:string;

  constructor(
    private modalService : ModalService,
    public mtModalRef : MatDialogRef<any>,
  )
  {}

  ngOnInit(){
    // this.title = this.mtModalRef.title;
    // this.message =  this.mtModalRef.message;
  }
}
