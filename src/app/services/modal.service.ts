/**
 * This sevice contains functions used to open components as a pop up 
 * 
 */

import { Injectable } from '@angular/core';
import {MatDialog,MatDialogRef,DialogPosition} from '@angular/material/dialog';
import { BehaviorSubject, timer} from 'rxjs';

import { ProgressAlertComponent} from '../views/progress-alert/progress-alert.component'; 
import {AppComponent} from '../app.component';
import {AppModule} from '../../app/app.module';


@Injectable({
  providedIn: 'root'
})
export class ModalService {
  deviceInformation:any;
  isThirdGenBrowser : boolean = AppModule.isThirdGenBrowser;

  private fromData = new BehaviorSubject<string>('');
  currentValue = this.fromData.asObservable();

  constructor(
    public dialog : MatDialog,
    public  app : AppComponent    
    ) {}
  

  private calculateCenterPosition(dialogWidth: number, dialogHeight: number): DialogPosition {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
  
      const topPosition = Math.max(0, (viewportHeight - dialogHeight) / 2);
      const leftPosition = Math.max(0, (viewportWidth - dialogWidth) / 2);
  
      return { top: topPosition + 'px', left: leftPosition + 'px' };
  }

  //function to show progress alert as a pop up
  showProgressAlert(title: string, message : string):MatDialogRef<ProgressAlertComponent>{
    
    return this.dialog.open(ProgressAlertComponent, {
      data :{'title': title,'message':message},      
    });
  }

  //function to close the passed reference of modal pop up
  closeModal(modalRef :MatDialogRef<any>){
    if(modalRef){
      modalRef.close();
    }
   }

   //function to open large pop up 
  public openLargeModal(component : any):void{
  const dialogWidth = 1024;
  const dialogHeight = 768;
  const position = this.calculateCenterPosition(dialogWidth, dialogHeight);
  const dialogRef =
     this.dialog.open(component, {
      width: '1024px',
      height : '',
      position: position,
      panelClass:'makeItMiddle',
      data:{closeBtnName:'Close'},
      hasBackdrop : false,
      disableClose:true
    });
  }

  //function to open a pop up without a close button
  public openModalWithoutClose(component : any,title: string,message : string)
  {
    return this.dialog.open(component, {
      data :{'title': title,'message':message},     
    });

  }

  //set data to fromData
  setData(data:any){
    this.fromData.next(data);
  }

  public openModal(component : any,dialog_postion:any,rotationClass: string = ''){
    this.dialog.closeAll();
    this.dialog.openDialogs.pop();
    let panelClass: string[] = ['custom-modalbox'];
    if (rotationClass!== '') {
     panelClass.push(rotationClass);
    }
    let dialogRef = this.dialog.open(component,{
      panelClass: 'custom-modalbox',
      position: dialog_postion,
      
    });
    
    dialogRef.afterClosed().subscribe(result => {

    });
    return dialogRef;
  }
  
  //function to open a modal with title
  public openModalWithTitle(component : any,title: string,message : string){

    this.dialog.closeAll();
    this.dialog.openDialogs.pop();
    return  this.dialog.open(component, {
      data :{'title': title,'message':message},
    });

  }


  public showAlert(component : any,title: string,message : string)
  {
     this.dialog.open(component, {
      data :{'title': title,'message':message}
    });
    timer(3000).subscribe(()=>{
      this.dialog.closeAll();
    })
  }

  //function to close all open modals
  public closeAllModals()
  {
    this.dialog.closeAll();
  }

  //function to open a pop up with some paramters 
  public openComponentModal(component: any,data:any)
  {
    this.dialog.closeAll();
    this.dialog.open(component, {
      data : data
    });
  }

}

