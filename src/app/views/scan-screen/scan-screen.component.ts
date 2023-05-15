//scan-screen.component.ts

import { Component } from '@angular/core';
import {MatDialog,MatDialogRef} from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule,AbstractControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {Blob} from 'blob';
import { saveAs } from 'file-saver';
import {FeaturePopoverComponent} from '../feature-popover/feature-popover.component';
import { PrivacyPolicyComponent} from '../privacy-policy/privacy-policy.component';
import { PopupCompComponent} from '../popup-comp/popup-comp.component';
import { ModalService} from '../../services/modal.service';
import { ScanOptionsService} from '../../services/scan-options.service';
import { FileFormat, FileFormatOption} from '../../model/global';
import { ScanService } from '../../services/scan.service';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { AppComponent } from '../../app.component';
import {selectedNote,AppSetting} from '../../model/global'
import { LogService } from '../../services/log.service';
import {xrxScanV2GetInterfaceVersion} from '../../../assets/Xrx/XRXScanV2';
import {xrxJobMgmtGetInterfaceVersion} from '../../../assets/Xrx/XRXJobManagement';
import {xrxTemplateGetInterfaceVersion} from '../../../assets/Xrx/XRXTemplate';
import {xrxDeviceConfigGetInterfaceVersion} from '../../../assets/Xrx/XRXDeviceConfig';
import {AppModule} from '../../app.module';


@Component({
  selector: 'app-scan-screen',
  templateUrl: './scan-screen.component.html',
  styleUrls: ['./scan-screen.component.scss']
})
export class ScanScreenComponent {

  file={
    name:'File Name',
    type:'Type'
  }; 
  showPrivacySetting=false;
  showLoader=false;
  validationStatus: boolean = false;
  isCreditsEnabled: boolean = false;
  maxPagesPerJobStyle: string = 'text-align:left !important;';
  emailHasError: boolean = false;
  
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
  generation = AppModule.Generation;
  model = AppModule.model;
  selectedNote : selectedNote;

  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private modalService : ModalService,
    private scanOptionService : ScanOptionsService,
    private scanService :ScanService,
    private appComponent : AppComponent,
    private  logger: LogService,
    
    ) {}

    ngOnInit(){
      //console.log(this.generation);
      //console.log("model :" + this.model);
      //alert("Ng Oninit Generation :" +this.generation);
      //alert("Ng Oninit model :"+ this.model);

      // this.activatedRoute.queryParams.subscribe(params => {
      // const paramsJsonStr = JSON.stringify(params, null, 2);
      // console.log(`scanScreen -> paramsJsonStr: ${paramsJsonStr}`);
      // });

      // If we have an email in session, attempt to validate fields (to enable scan button)
      // if (Global.Email) 
      // {
      //   this.validateAllFields();
      // }

      // If not eigth gen, whenever scroll-container scrolls (its an accident, so scrolltop to 0) to fix shadows
      /* if (!this.device.isEighthGen && !this.device.isThirdGenBrowser) {
      const scrollContainer = document.querySelector('.scroll-container') as HTMLElement; //TODO:reference package https://www.npmjs.com/package/angular-iscroll
      scrollContainer.addEventListener('scroll', _.debounce(() => {
        scrollContainer.scrollTop = 0;
      }, 250, { leading: true }));
      } */

      
  
      this.createForm();

      this.getDefaultValues();
      
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
    getDefaultValues(){
      this.selectedFileFormat = this.scanOptionService.getFileFormat(this.anyFileFormat);
      this.selectedFileFormatOptions = this.selectedFileFormat.options.find(item => item.isDefault === true);
      this.selectedType = this.scanOptionService.getFileFormat(this.anyType);
      this.selectedTypeOptions = this.selectedType.options.find(item => item.isDefault === true);
      this.selectedSize = this.scanOptionService.getFileFormat(this.anySize);
      this.selectedSizeOptions = this.selectedSize.options.find(item => item.isDefault === true);
    }

    createForm(){
      this.noteConvertorForm = this.formBuilder.group({
        email:['',[Validators.required,Validators.email]],
        confirmEmail:['',[Validators.required,Validators.email]],
        fileName : ['']
      },
      { validators: this.emailMatchValidator },
     );
    }

     emailMatchValidator(form: FormGroup) {
      const email = form.get('email').value;
      const confirmEmail = form.get('confirmEmail').value;
      return email === confirmEmail ? null : { emailsMatch: true };
    }
  
    get f():{[key: string]: AbstractControl}{
        return this.noteConvertorForm.controls;
    }

      
    resetForm(){
      this.noteConvertorForm.patchValue({
        email:'',
        confirmEmail:'',
        fileName : ''
      });
      this.getDefaultValues();
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

    validateAllFields(): void {
      // TODO: Implement validateAllFields function
    }

    refreshCredits(): void {
      // TODO: Implement refreshCredits function
    }

    clearValidation(): void {
      // TODO: Implement clearValidation function
    }

    exit(): void {
      // TODO: Implement exit function
    }
// scan functionalities 

scan() {
  this.logger.logMsg('ctrl.scan ...', 'information');
   this.mainDeviceconfig();
};

 mainDeviceconfig() {
  this.logger.logMsg('mainDeviceconfig()...', 'information');
  const regex = /^[^\\\/\:\*\?\"\<\>\|]+$/;
  let fileName : string = this.noteConvertorForm.controls["fileName"].value
  if (regex.test(fileName)) {
    this.logger.logMsg('mainDeviceconfig() -> if (regex.test(fileName))', 'information');
    xrxDeviceConfigGetInterfaceVersion(AppSetting.url, this.deviceCallbackSuccess.bind(this), this.deviceCallBackFailure.bind(this), null, true);
  } else {
    this.logger.logMsg('mainDeviceconfig() ELSE FOR if (regex.test(fileName))', 'information');
    //const text = strings['SDE_CHARACTERS_CANNOT_BE'].replace('{0}', '\\ / : * ? " < > |');
    //errorHandlerService.showErrorAlert(text, '', null, null);
  }
}

deviceCallbackSuccess() {
  this.logger.logMsg('DeviceCallBack_Success -> respText:', 'success');
  this.getScanStatus();
}

 deviceCallBackFailure(respText, newresp) {
  this.logger.logMsg('DeviceCallBack_Failure -> respText:' + respText + ' newresp:' + newresp, 'error');
  //errorHandlerService.XBB_DEVICE_EIP_DEVICE_CONFIG_DISABLED();
}

getScanStatus() {
  this.logger.logMsg('getScanStatus()...', 'information');
  xrxScanV2GetInterfaceVersion(AppSetting.url, 
    this.callback_success.bind(this), 
    this.callback_failure.bind(this), 
    null, true);
  
}
callback_success(reqText, respText) {
  this.logger.logMsg('getScanStatus() -> callback_success', 'information');
  this.getjobmamt();
}
callback_failure(respText, newresp) {
  this.logger.logMsg('callback_failure -> respText:' + respText + ' newresp:' + newresp, 'error');
  //errorHandlerService.DEVICE_EIP_SCANV2_SERVICES_DISABLED();
}

 getjobmamt() {
  this.logger.logMsg('getjobmanagementInterfaceVersion()...', 'information');
  xrxJobMgmtGetInterfaceVersion(AppSetting.url, this.Jobcallback_success.bind(this), this.Jobcallback_failure.bind(this), null, true);
}

Jobcallback_success(reqText, respText) {
  this.logger.logMsg('Jobcallback_success()...', 'information');
  this.CheckTemplate();
}
Jobcallback_failure(reqText, respText) {
  this.logger.logMsg('Jobcallback_failure -> reqText:' + reqText + ' respText:' + respText, 'error');
  //errorHandlerService.DEVICE_EIP_SCANV2_SERVICES_DISABLED();
}

CheckTemplate() {
  xrxTemplateGetInterfaceVersion(AppSetting.url, this.Templatecallback_success.bind(this), this.Templatecallback_failure.bind(this), null, true);
}

Templatecallback_success() {
  this.logger.logMsg('Templatecallback_success()...', 'information');
  this.selectedNote={
    fileFormat : this.selectedFileFormatOptions,
    size : this.selectedSizeOptions,
    type : this.selectedTypeOptions,
    fileName : this.noteConvertorForm.controls["fileName"].value,
    email :  this.noteConvertorForm.controls["email"].value
  }
   
  var values = this.scanOptionService.getValues(this.selectedNote);

  this.logger.logMsg('Templatecallback_success() values:' + values, 'information');

  '##############################################################################'
  '####################              SCAN       #################################'
  '##############################################################################'

  this.scanService.scan(values);
}

 Templatecallback_failure(respText, newresp) {
  this.logger.logMsg('Templatecallback_failure -> respText:' + respText + ' newresp:' + newresp, 'error');
  //errorHandlerService.DEVICE_EIP_SCANV2_SERVICES_DISABLED();
}
    
}
