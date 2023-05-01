//scan-screen.component.ts

import { Component } from '@angular/core';
import {MatDialog,MatDialogRef} from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule,AbstractControl } from '@angular/forms';
import {Blob} from 'blob';
import { saveAs } from 'file-saver';
import {FeaturePopoverComponent} from '../feature-popover/feature-popover.component';
import { PrivacyPolicyComponent} from '../privacy-policy/privacy-policy.component';
import { PopupCompComponent} from '../popup-comp/popup-comp.component';
import { ModalService} from '../../services/modal.service';
import { ScanOptionsService} from '../../services/scan-options.service';
import { FileFormat, FileFormatOption} from '../../model/common';

interface Images {
  id: string,
  author: string,
  download_url: string
}

@Component({
  selector: 'app-scan-screen',
  templateUrl: './scan-screen.component.html',
  styleUrls: ['./scan-screen.component.scss']
})
export class ScanScreenComponent {

  images: Images[] | [];
  
  scanTypes: any = ['1 Sided Scanning', '2 Sided Scanning'];
  scannedType:string;
  file={
    name:'File Name',
    type:'Type'
  }; 
  showPrivacySetting=false;
  showLoader=false;

  noteConvertorForm:  FormGroup;

   const_fileFormat : string = "fileFormat";
   const_type : string = "type";
   const_size : string = 'size';

   anyFileFormat = {from : 'fileFormat'};
   anyType = {from : 'type'};
   anySize = {from : 'size'};

  matDialogRef: MatDialogRef<any>;
  selectedFileFormat : FileFormat;
  selectedFileFormatOptions : FileFormatOption;
  selectedType : FileFormat;
  selectedTypeOptions : FileFormatOption;
  selectedSize : FileFormat;
  selectedSizeOptions : FileFormatOption;
  submitted = false;

  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private modalService : ModalService,
    private scanOptionService : ScanOptionsService
    ) {}

    ngOnInit(){
      this.createForm();

      
      this.selectedFileFormat = this.scanOptionService.getFileFormat(this.anyFileFormat);
      this.selectedFileFormatOptions = this.selectedFileFormat.options.find(item => item.isDefault === true);
      this.selectedType = this.scanOptionService.getFileFormat(this.anyType);
      this.selectedTypeOptions = this.selectedType.options.find(item => item.isDefault === true);
      this.selectedSize = this.scanOptionService.getFileFormat(this.anySize);
      this.selectedSizeOptions = this.selectedSize.options.find(item => item.isDefault === true);

      //observables to show selected values
      this.scanOptionService.selectedFileFormatC.subscribe(object =>{
        if(object){
          this.selectedFileFormatOptions = object;
        }
      })

      this.scanOptionService.selectedTypeC.subscribe(type =>{
        if(type){
          this.selectedTypeOptions = type;
        }
      })

      this.scanOptionService.selectedSizeC.subscribe(size =>{
        if(size){
          this.selectedSizeOptions = size;
        }
      })
    }
    createForm(){
      this.noteConvertorForm = this.formBuilder.group({
        email:['',[Validators.required,Validators.email]],
        confirmEmail:['',[Validators.required,Validators.email]],
   
      },
      { validator: this.matchingEmailsValidator('email', 'confirmEmail') }
     );
    }
    matchingEmailsValidator(emailKey: string, confirmEmailKey: string) 
      { return (group: FormGroup): {[key: string]: any} => 
        { 
            const email = group.controls[emailKey]; 
            const confirmEmail = group.controls[confirmEmailKey]; 
            if (email.value !== confirmEmail.value) { 
                return { emailsNotMatch: true }; 
              } 
              return null; 
         }; 
      }

      get f():{[key: string]: AbstractControl}{
        return this.noteConvertorForm.controls;
      }

      scanDocument(event:any){
          debugger;
          
          this.showLoader = true;
          this.showLoader = true;
          this.file = event.target.files[0];
          this.file = event.target.files[0];
          const fileContents=this.file;
          var blob:any;
          blob =new blob([fileContents],{type:'text/plain'});
          saveAs(blob,'xerox_file').subscribe((res:any)=>{
          
          const formData = new FormData();
         
          formData.append('xerox_file',event.target.files[0]);
          
            this.showLoader = false;
          
            if(res.status === 200){
          
              this.openSuccessPopup();
            }
          //   }
          },err=>{
            this.showLoader = false;
          });
          
        
        }

    getFileType(fullFileType){
      if(fullFileType){
        let tempFile = fullFileType.split('/');
        return tempFile[tempFile.length - 1];
      }
    }
    getScanType() {
      this.scannedType = this.noteConvertorForm.get('selectScanType').value
    }
    resetForm(){
      this.noteConvertorForm.patchValue({
        email:'',
        confirmEmail:'',
        selectScanType:''
      });
      this.file = {
        name:'File Name',
        type:'Type'
      };
      this.scannedType='';
    }
    
    openSuccessPopup(){
        this.dialog.open(PopupCompComponent,{
          width:'550px',
          height:'250px',
          backdropClass:'custom-backdrop-color'
        });
    }

    showPrivacyStatement(){
      //this.dialog.open(PrivacyPolicyComponent);
      const modalRef = this.modalService.openLargeModal(PrivacyPolicyComponent);
      //modalRef.content.closeBtnName = 'Close';
      //this.bsModalRef = this.modalService.show(PrivacyPolicyComponent);
    }

    openFileFormat(){
      this.modalService.setData({
        from : this.const_fileFormat
      });
      const modalRef = this.modalService.openModal(FeaturePopoverComponent);
      //modalRef.content.closeBtnName = 'Close';
    }

    openScan(){
      this.modalService.setData({
        from : this.const_type
      });
      const modalRef = this.modalService.openModal(FeaturePopoverComponent);
      //modalRef.content.closeBtnName = 'Close';
    }

    openSize(){
      this.modalService.setData({
        from : this.const_size
      });
      const modalRef = this.modalService.openModal(FeaturePopoverComponent);
      //modalRef.content.closeBtnName = 'Close';
    }

  //  ngOnDestroy(){
  //   this.scanOptionService.selectedFileFormatC.unsubscribe();
  //  }
}
