import { Injectable } from '@angular/core';
import {MatDialog,MatDialogRef} from '@angular/material/dialog';
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
      panelClass: (!this.isThirdGenBrowser) ? 'allow-outside-interaction' : 'allow-outside-banner-interaction'    
    });
  }

  closeModal(modalRef :MatDialogRef<any>){
    //alert("close modal begin");
    if(modalRef){
      //alert("close modal inside")
      modalRef.close();
    }
   }

  public openLargeModal(component : any):void{

  const dialogRef =
     this.dialog.open(component, {
      width : 'auto',
      height : 'auto',
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

  public openModal(component : any){
    //alert('before close :'+this.dialog.openDialogs.length);
    this.dialog.closeAll();
    this.dialog.openDialogs.pop();
    let dialogRef = this.dialog.open(component);
    
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
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%'
    });

  }


  public showAlert(component : any,title: string,message : string)
  {
      //dependency in error handler service Ln:20, function to be written
      //this.dialog.closeAll();

     this.dialog.open(component, {
      data :{'title': title,'message':message}
    });

    timer(3000).subscribe(()=>{
      this.dialog.closeAll();
    })
  }

  public closeAllModals()
  {
    //dependency in error handler service Ln:29, function to be written
    this.dialog.closeAll();
  }

  public openComponentModal(component: any,data:any)
  {
    //dependency in error handler service Ln:29, function to be written
    this.dialog.closeAll();
    this.dialog.open(component, {
      data : data
    });
  }

}

