//scan-screen.component.ts

import { Component,ViewChild,ElementRef, OnInit } from '@angular/core';
import {MatDialog,MatDialogRef} from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators,AbstractControl } from '@angular/forms';//ReactiveFormsModule,
//import { ActivatedRoute } from '@angular/router';
import {FeaturePopoverComponent} from '../feature-popover/feature-popover.component';
import { PrivacyPolicyComponent} from '../privacy-policy/privacy-policy.component';
//import { PopupCompComponent} from '../popup-comp/popup-comp.component';
import { ModalService} from '../../services/modal.service';
import { ScanOptionsService} from '../../services/scan-options.service';
import { FileFormat, FileFormatOption,resourceString,Strings} from '../../model/global';
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
//import { EditableFileNameDirective } from  '../../Directives/editable-file-name.directive';
//import {TranslatePipe} from '../../filters/translate.pipe';

import { ResourcestringService} from '../../services/resourcestring.service';



@Component({
  selector: 'app-scan-screen',
  templateUrl: './scan-screen.component.html',
  styleUrls: ['./scan-screen.component.scss'],
  
})
export class ScanScreenComponent implements OnInit{

  @ViewChild('fileNameSpan', { static: true }) fileNameSpan: ElementRef;
  showPrivacySetting=false;
  //showLoader=false;
  //validationStatus: boolean = false;
  //isCreditsEnabled: boolean = false;
  //maxPagesPerJobStyle: string = 'text-align:left !important;';
  //emailHasError: boolean = false;
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
  //submitted = false;
  generation = AppModule.Generation;
  model = AppModule.model;
  selectedNote : selectedNote;
  resource_Strings:Strings;
  emailPlaceHolder : string;
  xeroxTitle : string;
  scanTitle : string;
  resetTitle : string;
  privacyStatementTitle : string;
  emailValidation1 : string;

  fileName: string = '';
  defaultFilename : string ='Xerox Scan';
  resourceString : resourceString[];
  testfilename: string='';

  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    //private activatedRoute: ActivatedRoute,
    private modalService : ModalService,
    private scanOptionService : ScanOptionsService,
    private scanService :ScanService,
    private appComponent : AppComponent,
    private  logger: LogService,
    private resourceStringService : ResourcestringService,
   // private translatePipe : TranslatePipe,
    private errorHandlerService : ErrorHandlerService
    ) {
      

    }

    ngOnInit(){

      //alert(this.appComponent.Strings["ONE_SIDED"]);
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
      this.resourceStringService.loadResources().then(response=>{
        this.fileName=response.SDE_XEROX_SCAN.toString()+' [Date & Time].';
        this.emailPlaceHolder = response.SDE_ENTER_EMAIL_RECEIVE1;
        this.xeroxTitle = response.SDE_WRITTEN_NOTE_CONVERSION4;
        this.scanTitle = response.SDE_SCAN;
        this.resetTitle = response.SDE_RESET;
        this.privacyStatementTitle = response.SDE_PRIVACY_STATEMENT;
        this.emailValidation1 = response.SDE_EMAIL_NOT_VALID;
      }).catch(error=>{
        console.log(' catch error');
      });
      //this.logger.trackTrace("Test application insight");
      
      this.resourceString = this.resourceStringService.getObjStrings();
  
      this.createForm();

      this.getDefaultValues();
      //this.fileName = this.getDefaultFileName();
      
      //observables to show selected values
      this.scanOptionService.selectedFileFormatC.subscribe(object =>{
        if(object){
          this.selectedFileFormatOptions = object;        
          //this.updateFileName();
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

    ngAfterViewInit() {
     //this.fileName = this.fileNameSpan.nativeElement.textContent;
      //console.log('File name:', fileName);
      // You can perform further processing with the fileName value here
    }
    // getDefaultFileName(): string {
    //   //const now = new Date();
    //   //const dateAndTime = now.toLocaleString('en-US', { hour12: false, timeZone: 'UTC' }).replace(/[/:\s]/g, '');
    //   return `@${this.fileName}`+'[Date & Time].'+this.selectedFileFormatOptions.value;//${dateAndTime}
    // }
    // updateFileName() {
    //   const atIndex = this.fileName.indexOf('.');
    //   const fileName = this.fileName.slice(0,atIndex).trim();
    //   this.fileName = fileName+'.';
    //   this.fileName += this.selectedFileFormatOptions.value;
    // }

    // onFileNameClick() {
    //   // // Trim the default value to show only "@ Xerox Scan"     
    //    this.fileName = '@ Xerox Scan'
    // }
    // onFileNameBlur(){
    //   this.fileName += ' [Date & Time].'+this.selectedFileFormatOptions.value;
    // }

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
        fileName : ['']//this.fileName
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
      //this.logger.trackTrace("Reset Form");
      this.noteConvertorForm.patchValue({
        email:'',
        confirmEmail:'',
        fileName : ''
      });
      //this.fileNameSpan.nativeElement.textContent = this.defaultFilename;
      this.getDefaultValues();
    }
    
    // openSuccessPopup(){
    //     this.dialog.open(PopupCompComponent,{
    //       width:'550px',
    //       height:'250px',
    //       backdropClass:'custom-backdrop-color'
    //     });
    // }

    showPrivacyStatement(){
      //this.logger.trackTrace("Privacy Statement");
      this.modalService.openLargeModal(PrivacyPolicyComponent);
      //this.modalService.openModalWithTitle(AlertBannerComponent,'is scanning','');
    }

    openFileFormat(){
      //alert("FileFOrmat");
      //this.logger.trackTrace("Open File Format");
      this.modalService.setData({
        from : this.const_fileFormat
      });
      this.modalService.openModal(FeaturePopoverComponent);//alert("fffff");
      //modalRef.content.closeBtnName = 'Close';
    }

    openScan(){
      //this.logger.trackTrace("Open Scan");
      this.modalService.setData({
        from : this.const_type
      });
      this.modalService.openModal(FeaturePopoverComponent);//alert("scaa");
      //modalRef.content.closeBtnName = 'Close';
    }

    openSize(){
      //this.logger.trackTrace("Open Size");
      this.modalService.setData({
        from : this.const_size
      });
       this.modalService.openModal(FeaturePopoverComponent);//alert("ssss");
      //modalRef.content.closeBtnName = 'Close';
    }

    
// scan functionalities 

scan() {
  //this.logger.logMsg('ctrl.scan ...', 'information');
  this.logger.trackTrace("ctrl.scan ...");
  //this.modalService.openModalWithTitle(ProgressAlertComponent,this.resourceString['SDE_SCANNING1'],'');
  
   this.mainDeviceconfig();
};

 mainDeviceconfig() {
  this.logger.trackTrace("mainDeviceconfig()...");
  const regex = /^[^\\\/\:\*\?\"\<\>\|]+$/;

  this.fileName =  this.noteConvertorForm.controls["fileName"].value == '' ? this.defaultFilename : this.noteConvertorForm.controls["fileName"].value; //this.fileNameSpan.nativeElement.textContent
  //alert(this.fileName);
  if (regex.test(this.fileName)) {
    //this.logger.logMsg('mainDeviceconfig() -> if (regex.test(fileName))', 'information');
    this.logger.trackTrace("mainDeviceconfig() -> if (regex.test(fileName))");
    xrxDeviceConfigGetInterfaceVersion(AppSetting.url, this.deviceCallbackSuccess.bind(this), this.deviceCallBackFailure.bind(this), null, true);
  } else {
    //this.logger.logMsg('mainDeviceconfig() ELSE FOR if (regex.test(fileName))', 'information');
    this.logger.trackTrace("mainDeviceconfig() ELSE FOR if (regex.test(fileName))");
    const text = this.resourceString['SDE_CHARACTERS_CANNOT_BE'].replace('{0}', '\\ / : * ? " < > |');
    this.errorHandlerService.showErrorAlert(text, '', null, null);
  }
}

deviceCallbackSuccess() {
  this.logger.trackTrace("DeviceCallBack_Success -> respText:");
  this.getScanStatus();
}

 deviceCallBackFailure(respText, newresp) {
  this.logger.trackTrace("DeviceCallBack_Failure -> respText:' + respText + ' newresp:' + newresp");
  //this.errorHandlerService.XBB_DEVICE_EIP_DEVICE_CONFIG_DISABLED();
}

getScanStatus() {
  //this.logger.logMsg('getScanStatus()...', 'information');
  this.logger.trackTrace("getScanStatus()...");
  xrxScanV2GetInterfaceVersion(AppSetting.url, 
    this.callback_success.bind(this), 
    this.callback_failure.bind(this), 
    null, true);
  
}
callback_success(reqText, respText) {
  //this.logger.logMsg('getScanStatus() -> callback_success', 'information');
  this.logger.trackTrace("getScanStatus() -> callback_success");
  this.getjobmamt();
}
callback_failure(respText, newresp) {
  //this.logger.logMsg('callback_failure -> respText:' + respText + ' newresp:' + newresp, 'error');
  this.logger.trackTrace('callback_failure -> respText:' + respText + ' newresp:' + newresp);
  this.errorHandlerService.DEVICE_EIP_SCANV2_SERVICES_DISABLED();
}

 getjobmamt() {
  //this.logger.logMsg('getjobmanagementInterfaceVersion()...', 'information');
  this.logger.trackTrace('getjobmanagementInterfaceVersion()...');
  xrxJobMgmtGetInterfaceVersion(AppSetting.url, this.Jobcallback_success.bind(this), this.Jobcallback_failure.bind(this), null, true);
}

Jobcallback_success(reqText, respText) {
  //this.logger.logMsg('Jobcallback_success()...', 'information');
  this.logger.trackTrace('Jobcallback_success()...');
  this.CheckTemplate();
}
Jobcallback_failure(reqText, respText) {
  //this.logger.logMsg('Jobcallback_failure -> reqText:' + reqText + ' respText:' + respText, 'error');
  this.logger.trackTrace('Jobcallback_failure -> reqText:' + reqText + ' respText:' + respText);
  this.errorHandlerService.DEVICE_EIP_SCANV2_SERVICES_DISABLED();
}

CheckTemplate() {
  xrxTemplateGetInterfaceVersion(AppSetting.url, this.Templatecallback_success.bind(this), this.Templatecallback_failure.bind(this), null, true);
}

Templatecallback_success() {
  //this.logger.logMsg('Templatecallback_success()...', 'information');
  this.logger.trackTrace('Templatecallback_success()...');
  this.selectedNote={
    fileFormat : this.selectedFileFormatOptions,
    size : this.selectedSizeOptions,
    type : this.selectedTypeOptions,
    fileName : this.noteConvertorForm.controls["fileName"].value == '' ? this.defaultFilename : this.noteConvertorForm.controls["fileName"].value,//this.fileNameSpan.nativeElement.textContent
    email :  this.noteConvertorForm.controls["email"].value
  }

  var values = this.scanOptionService.getValues(this.selectedNote);

  //this.logger.logMsg('Templatecallback_success() values:' + values, 'information');
  this.logger.trackTrace('Templatecallback_success() values:' + values);

  // '##############################################################################'
  // '####################              SCAN       #################################'
  // '##############################################################################'

  this.scanService.scan(values);
}

 Templatecallback_failure(respText, newresp) {
  //this.logger.logMsg('Templatecallback_failure -> respText:' + respText + ' newresp:' + newresp, 'error');
  this.logger.trackTrace('Templatecallback_failure -> respText:' + respText + ' newresp:' + newresp);
  this.errorHandlerService.DEVICE_EIP_SCANV2_SERVICES_DISABLED();
}
    
}
