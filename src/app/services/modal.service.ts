import { Injectable } from '@angular/core';
import {MatDialog,MatDialogRef,MatDialogConfig,DialogPosition,MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Overlay, OverlayPositionBuilder } from '@angular/cdk/overlay';
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
    this.dialog.closeAll();
   
    return this.dialog.open(ProgressAlertComponent, {
      data :{'title': title,'message':message}, 
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

  public openModal(component : any,dialog_postion:any){
    this.dialog.closeAll();
    this.dialog.openDialogs.pop();
    let dialogRef = this.dialog.open(component,{
      position: dialog_postion,
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

