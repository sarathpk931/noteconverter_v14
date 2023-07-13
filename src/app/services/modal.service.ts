import { Injectable } from '@angular/core';
import {MatDialog,MatDialogRef,MatDialogConfig,DialogPosition,MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Overlay, OverlayPositionBuilder } from '@angular/cdk/overlay';
import { ProgressAlertComponent} from '../views/progress-alert/progress-alert.component'; 
import {AppComponent} from '../app.component';
import { BehaviorSubject, finalize, timer} from 'rxjs';
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
    public  app : AppComponent,
    private overlay: Overlay,
    private positionBuilder: OverlayPositionBuilder 
    ) {}
  

    private centerDialog(dialogElement: HTMLElement): DialogPosition {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const dialogWidth = dialogElement.offsetWidth;
      const dialogHeight = dialogElement.offsetHeight;
    
      const topPosition = Math.max(0, (viewportHeight - dialogHeight) / 2);
      const leftPosition = Math.max(0, (viewportWidth - dialogWidth) / 2);
    
      return { top: topPosition + 'px', left: leftPosition + 'px' };
    }
    

  showProgressAlert(title: string, message : string):MatDialogRef<ProgressAlertComponent>{
    
    return this.dialog.open(ProgressAlertComponent, {
      data :{'title': title,'message':message},
      position: {
        top: '',
        left: 'calc(50% - 512px)',
        
    },
      //panelClass: (!this.isThirdGenBrowser) ? 'allow-outside-interaction' : 'allow-outside-banner-interaction'
      //panelClass:'progress-bar-modalbox'
      
    });
  }

  closeModal(modalRef :MatDialogRef<any>){
    if(modalRef){
      modalRef.close();
    }
   }

   public openLargeModal(component: any): void {
    const windowWidth = window.innerWidth;
    const popupWidth = 1024;
    const leftPosition = Math.max((windowWidth / 2) - (popupWidth / 2), 0) + 'px';
    const rightPosition = Math.max((windowWidth / 2) + (popupWidth / 2), windowWidth - popupWidth) + 'px';
  
    const dialogRef = this.dialog.open(component, {
      data: { closeBtnName: 'Close' },
      hasBackdrop: false,
      disableClose: true,
      height: '',
      width: '',
      position: {
        top: '',
        left: leftPosition,
        right: rightPosition,
      },
    });
  }
  
  public openModalWithoutClose(component : any,title: string,message : string)
  {
    return this.dialog.open(component, {
      data :{'title': title,'message':message},
      position: {
        top: '',
        left: 'calc(50% - 512px)',
        
    },    
    });

  }

  setData(data:any){
    this.fromData.next(data);
  }

  public openModal(component : any,dialog_postion:any,  clickPosition:any){
    document.querySelectorAll("#modal_arrow").forEach(e => e.parentNode.removeChild(e));
    this.dialog.closeAll();
    this.dialog.openDialogs.pop();

    let dialogRef = this.dialog.open(component,{
      position: dialog_postion,
      panelClass: `custom-dialog-position`,
      data: { clickPosition, additionalInfo: `calc(${clickPosition.y}px - ${dialog_postion.top})`}
    });
    

    dialogRef.afterOpened().subscribe(result => {
      const customDialogPosition : HTMLElement = document.querySelector(".custom-dialog-position");
      customDialogPosition.style.top = dialog_postion.top;
      if(dialog_postion.left) {
        customDialogPosition.style.left = dialog_postion.left;
      } else if(dialog_postion.right) {
        customDialogPosition.style.right = dialog_postion.right;
      }
    });
    
    const arrowsSize = 20;
    const common_arrow_style = `
      position: absolute; 
      width: 0; 
      height: 0; 
      border-top: ${arrowsSize}px solid transparent; 
      border-bottom: ${arrowsSize}px solid transparent; 
      z-index: 1000; 
      top: ${clickPosition.y  - arrowsSize}px;
    `
    const modalArrow = document.createElement("div");
    const modalBoxShadow = 2;
    modalArrow.id = 'modal_arrow';

    if (clickPosition.showLeftArrow) {
      modalArrow.style.cssText += `
      ${common_arrow_style}
      border-right: ${arrowsSize}px solid #ddd;
      left: calc(${dialog_postion.left} - ${arrowsSize}px + ${modalBoxShadow}px);
    `;
    } else {
      modalArrow.style.cssText += `
      ${common_arrow_style}
      border-left: ${arrowsSize}px solid #ddd;
      right: calc(${clickPosition.xForRightArrow}px - ${arrowsSize}px + ${modalBoxShadow}px);
    `;
    }

    const popupContainer = document.querySelector('.cdk-overlay-container');
    popupContainer.appendChild(modalArrow);
   
    dialogRef.afterClosed()
    .pipe(finalize(() => {
      
      
      if (!document.querySelector(".cdk-overlay-pane")) {
        document.querySelectorAll("#modal_arrow").forEach(e => e.parentNode.removeChild(e));
      }

      
    }))
    .subscribe(data => {
      console.log(data);
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   // console.log(`Dialog result: ${result}`);

    //   // if (document.querySelector('#modal_arrow')) {
    //   //   const popupContainer = document.querySelector('.cdk-overlay-container');
    //   //   popupContainer.removeChild(document.querySelector('#modal_arrow'));
    //   // }


    //   // if (document.querySelector('#modal_left_arrow')) {
    //   //   popupContainer.removeChild(document.querySelector('#modal_left_arrow'));
    //   // } else if (document.querySelector('#modal_right_arrow')) {
    //   //   popupContainer.removeChild(document.querySelector('#modal_right_arrow'));
    //   // }
    //     // alert('a');
    // });

    // dialogRef.beforeClosed().subscribe(result => {
    //   // alert('aakash');
    //   document.querySelectorAll("#modal_arrow").forEach(e => e.parentNode.removeChild(e));
        
    // });
    return dialogRef;
  }
  
  public openModalWithTitle(component : any,title: string,message : string){

    this.dialog.closeAll();
    this.dialog.openDialogs.pop();
    return  this.dialog.open(component, {
      data :{'title': title,'message':message},
      position: {
        top: '',
        left: 'calc(50% - 512px)',
        
    },
    });

  }


  public showAlert(component : any,title: string,message : string)
  {

     this.dialog.open(component, {
      data :{'title': title,'message':message},
      position: {
        top: '',
        left: 'calc(50% - 512px)',
        
    },
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

