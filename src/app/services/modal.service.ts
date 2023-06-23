import { Injectable } from '@angular/core';
import {MatDialog,MatDialogRef,DialogPosition} from '@angular/material/dialog';
import { ProgressAlertComponent} from '../views/progress-alert/progress-alert.component'; 
import {AppComponent} from '../app.component';
import { BehaviorSubject, timer} from 'rxjs';
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
    ) { }

  showProgressAlert(title: string, message : string):MatDialogRef<ProgressAlertComponent>{
    return this.dialog.open(ProgressAlertComponent, {
      data :{'title': title,'message':message},
      // panelClass: (!this.isThirdGenBrowser) ? 'allow-outside-interaction' : 'allow-outside-banner-interaction'
      panelClass: 'progress-bar-modalbox' 
    });
  }

  closeModal(modalRef :MatDialogRef<any>){
    if(modalRef){
      modalRef.close();
    }
   }

  public openLargeModal(component : any):void{

  const dialogRef =
     this.dialog.open(component, {
      width: '1024px',
      height : '',
      //position: {
       // top: '50vh',
       // left: '50vw'
    //},
    panelClass:'makeItMiddle',
      data:{closeBtnName:'Close'},
      hasBackdrop : false,
      disableClose:true
    });
  }

  public openModalWithoutClose(component : any,title: string,message : string)
  {
    return this.dialog.open(component, {
      data :{'title': title,'message':message},     
    });

  }

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
      
      //direction: ModalDirection
      
    });
    
    dialogRef.afterClosed().subscribe(result => {
      //console.log(`Dialog result: ${result}`);
    });
    return dialogRef;
  }
  
  public openModalWithTitle(component : any,title: string,message : string){

    this.dialog.closeAll();
    this.dialog.openDialogs.pop();
    return  this.dialog.open(component, {
      data :{'title': title,'message':message},
      // maxWidth: '100vw',
      // maxHeight: '100vh',
      // height: '100%',
      // width: '100%'
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

  public closeAllModals()
  {
    this.dialog.closeAll();
  }

  public openComponentModal(component: any,data:any)
  {
    this.dialog.closeAll();
    this.dialog.open(component, {
      data : data
    });
  }

}

