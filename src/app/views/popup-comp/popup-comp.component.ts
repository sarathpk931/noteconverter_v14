import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-popup-comp',
  templateUrl: './popup-comp.component.html',
  styleUrls: ['./popup-comp.component.less']
})
export class PopupCompComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<PopupCompComponent>) {}

  ngOnInit(): void {
  }
  closeDialog(){
    this.dialogRef.close();
  }
}
