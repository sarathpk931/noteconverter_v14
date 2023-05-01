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
import { BehaviorSubject} from 'rxjs';


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
    const dialogRef = this.dialog.open(component, {
      maxWidth: '400vw',
      maxHeight: '600vh',
      panelClass: 'mat-dialog-large',
      data:{closeBtnName:'Close'}
    });
  }

  setData(data:any){
    this.fromData.next(data);
  }

  public openModal(component : any){
        
    const modalRef : MatDialogRef<any>  = this.dialog.open(component, {
      
    })
    return modalRef;
  }

}
