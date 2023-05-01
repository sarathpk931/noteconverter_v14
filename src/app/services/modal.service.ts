import { Injectable } from '@angular/core';
import {MatDialog,MatDialogRef} from '@angular/material/dialog';
import { ImagePreviewerComponent } from '../views/image-previewer/image-previewer.component';
import { LogoutConfirmationComponent } from '../views/logout-confirmation/logout-confirmation.component';
import { FeaturePopoverComponent } from '../views/feature-popover/feature-popover.component';
import { ProgressBannerComponent } from '../views/progress-banner/progress-banner.component';
import { AlertBannerComponent } from '../views/alert-banner/alert-banner.component';
import { BasicAlertComponent } from '../views/basic-alert/basic-alert.component';
import { ProgressAlertComponent} from '../views/progress-alert/progress-alert.component';
import { BsModalRef,BsModalService} from 'ngx-bootstrap/modal';
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
    private dialog : MatDialog,
    private modalService : BsModalService,
    public  app : AppComponent    
    ) { }

     
    openComponentModal(componentName: any, data?: any): BsModalRef {
      return this.modalService.show(componentName, { initialState: { data } });
    }

    showPreview(title: string, images: any[]): BsModalRef {
      return this.modalService.show(ImagePreviewerComponent, {
        initialState: { title, images }
      });
    }

    showLogoutConfirmation(): BsModalRef {
      return this.modalService.show(LogoutConfirmationComponent);
    }

    showPopover(feature: any, event: any): BsModalRef {
      return this.modalService.show(FeaturePopoverComponent, {
      //  initialState: { feature, event }             //error to be resolved
      });
    }

   

    showScanProgressBanner(loaderStatus: any): BsModalRef {
     
      this.deviceInformation= this.app.Device('http://localhost',5000,true);

      this.toggleProgressBanner = this.modalService.show(ProgressBannerComponent, {
        initialState: { loaderStatus },
        class: this.deviceInformation.isThirdGenBrowser          //error to be resolved
          ? 'allow-outside-banner-interaction'
          : 'allow-outside-interaction',
        ignoreBackdropClick: true,
        keyboard: false
      });
      return this.toggleProgressBanner;
    }

    closeScanProgressBanner(): void {
      if (this.toggleProgressBanner) {
        this.toggleProgressBanner.hide();
      }
    }

    /* showProgressAlert(title: string, body: string): BsModalRef {
      return this.modalService.show(ProgressAlertComponent, {
        initialState: { title, body }
      });
    } */

    showAlert(message: string): BsModalRef {
      const modalRef = this.modalService.show(AlertBannerComponent, {
        initialState: { message },
        class: this.deviceInformation.isThirdGenBrowser          //error to be resolved
          ? 'allow-outside-banner-interaction'
          : 'allow-outside-interaction',
        ignoreBackdropClick: true,
        keyboard: false
      });
      setTimeout(() => {
        modalRef.hide();
      }, 3000);
  
      return modalRef;
    
    }

    showSimpleAlert(
      title: string,
      body: string,
      buttonText: string = 'SDE_CLOSE'
    ): BsModalRef {
      return this.modalService.show(BasicAlertComponent, {
        initialState: { title, body, buttonText }
      });
    }

  setData(data:any){
    this.fromData.next(data);
  }

  // getData(){
  //   return this.dataSubject.asObservable();
  // }

  showProgressAlert(title: string, body : string):MatDialogRef<ProgressAlertComponent>{

    return this.dialog.open(ProgressAlertComponent,{
      data : {title,body },
    });
  }

  public openModal(component : any){
        
    const modalRef : BsModalRef = this.modalService.show(component, {
      class : 'modal-sm'    
    })
    return modalRef;
  }

  closeAllModals(): void {
    this.modalService.hide();
  }
 
 closeAllModal(modalRef : BsModalRef){
  if(modalRef){
    modalRef.hide();
  }
 }

 closeModal(modalRef : BsModalRef){
  if(modalRef){
    modalRef.hide();
  }
 }

 public openLargeModal(component : any){
        
  const modalRef : BsModalRef = this.modalService.show(component, {
    class : 'modal-lg'    
  })
  return modalRef;
}

}
