import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { ModalService} from '../../services/modal.service';

@Component({
  selector: 'app-progress-alert',
  templateUrl: './progress-alert.component.html',
  styleUrls: ['./progress-alert.component.scss']
})
export class ProgressAlertComponent {

  constructor(
    private modalService : ModalService,
    public mtModalRef : MatDialogRef<any>
  )
  {}

  ngOnInit(){
    //alert("tttt");
  }
}
