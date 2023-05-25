import { Injectable } from '@angular/core';
import {MatDialog,MatDialogRef} from '@angular/material/dialog';
/*import { ImagePreviewerComponent } from '../views/image-previewer/image-previewer.component';
import { LogoutConfirmationComponent } from '../views/logout-confirmation/logout-confirmation.component';
import { FeaturePopoverComponent } from '../views/feature-popover/feature-popover.component';
import { ProgressBannerComponent } from '../views/progress-banner/progress-banner.component';
import { AlertBannerComponent } from '../views/alert-banner/alert-banner.component';
import { BasicAlertComponent } from '../views/basic-alert/basic-alert.component';*/
import { ProgressAlertComponent} from '../views/progress-alert/progress-alert.component'; 
//import { BsModalRef,BsModalService} from 'ngx-bootstrap/modal';
//import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {AppComponent} from '../app.component';
import { BehaviorSubject, timer} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ModalService {

  public toggleProgressBanner: any;
  deviceInformation:any;
  

  private fromData = new BehaviorSubject<string>('');
    currentValue = this.fromData.asObservable();

  constructor(
    public dialog : MatDialog,
    //private modalService : BsModalService,
    public  app : AppComponent    
    ) { }

  showProgressAlert(title: string, body : string):MatDialogRef<ProgressAlertComponent>{

    return this.dialog.open(ProgressAlertComponent,{
      data : {title,body },
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
      width : 'auto',
      height : 'auto',
      data:{closeBtnName:'Close'},
      hasBackdrop : false
    });
  }

  public openModalWithoutClose(component : any,title: string,message : string)
  {
    return this.dialog.open(component, {
      data :{'title': title,'message':message}
    });

  }

  setData(data:any){
    this.fromData.next(data);
  }

  public openModal(component : any){
    //alert(this.dialog.openDialogs.length);
    this.dialog.closeAll();
   
    return  this.dialog.open(component, {
     });
    //  modalRef.afterClosed().subscribe((ref) => {
    //   alert("close");
    //    ref = null;
    // })
    // return modalRef;
  }
  
  public openModalWithTitle(component : any,title: string,message : string){

    this.dialog.closeAll();

    return  this.dialog.open(component, {
      data :{'title': title,'message':message}
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

