import { Component, OnInit } from '@angular/core';
import {MatDialog,MatDialogRef} from '@angular/material/dialog';
import { PopupCompComponent } from '../app/views/popup-comp/popup-comp.component';
import { FormBuilder, FormGroup, Validators,AbstractControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { xrxDeviceConfigGetDeviceInformation } from '../assets/Xrx/XRXDeviceConfig';
import {xrxStringToDom} from '../assets/Xrx/XRXXmlHandler';
import {xrxSessionGetSessionInfo,xrxSessionGetSessionInfoRequest}  from  '../assets/Xrx/XRXSession';
import {xrxGetElementValue} from '../assets/Xrx/XRXXmlHandler';
import {xrxCallWebservice,xrxCallAjax} from '../assets/Xrx/XRXWebservices';
import { LogService } from '../app/services/log.service';
import {ModalService} from '../app/services/modal.service';
import { PrivacyPolicyComponent } from '../app/views/privacy-policy/privacy-policy.component';

import { ScanOptionsService} from '../app/services/scan-options.service';
import { FileFormat, FileFormatOption} from '../app/model/common';

declare const _: any;

enum StatusCodes {
  success = 200,
  badRequest = 400
}

enum ErrorCodes {
  ok = 'OK'
}

interface Images {
  id: string,
  author: string,
  download_url: string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  images: Images[] | [];
  noteConvertorForm: FormGroup;
  scanTypes: any = ['1 Sided Scanning', '2 Sided Scanning'];
  scannedType:string;
  file={
    name:'File Name',
    type:'Type'
  };
  showPrivacySetting=false;
  showLoader=false;
  title: "Note Converter App";

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
    
    private modalService:ModalService, 
    private  logger: LogService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private scanOptionService : ScanOptionsService
    ) 
    {}

  
  ngOnInit(){
    this.Strings();
    this.Device('http://localhost',5000,true);
    this.Session('http://127.0.0.1',5000,true,'');
    this.createForm();

    this.selectedFileFormat = this.scanOptionService.getFileFormat(this.anyFileFormat);
      this.selectedFileFormatOptions = this.selectedFileFormat.options.find(item => item.isDefault === true);
      this.selectedType = this.scanOptionService.getFileFormat(this.anyType);
      this.selectedTypeOptions = this.selectedType.options.find(item => item.isDefault === true);
      this.selectedSize = this.scanOptionService.getFileFormat(this.anySize);
      this.selectedSizeOptions = this.selectedSize.options.find(item => item.isDefault === true);
  }

  createForm(){
    this.noteConvertorForm = this.formBuilder.group({
      email:['',[Validators.required]],
      confirmEmail:['',[Validators.required]],
      selectScanType: ['',[Validators.required]],
    });
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
  /* scanDocument(event:any){
    this.showLoader = true;
    this.file = event.target.files[0];
    const formData = new FormData();
    formData.append('xerox_file',event.target.files[0]);
    //this.UseApi.saveFileLocaly(formData).subscribe((res:any)=>{
      this.showLoader = false;
      if(res.status === 200){
        this.openSuccessPopup();
      }
    },err=>{
      this.showLoader = false;
    });
    // this.openSuccessPopup();
  } */

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

  Strings = async () => {
    var regex = /(\w+)\-?/g;
    const locale = regex.exec(window.navigator.language || window.navigator.language)[1] || 'en';
    //const locale = navigator.language;
    const response = await fetch(`api/strings?lang=${encodeURIComponent(locale)}`);
    const data = await response.json();
    console.log('locale',data.strings)
    localStorage.setItem('locale',data.strings);
    return data.strings;
  };
  
  Device(url: string, timeout: number , async: boolean): Promise<any> {
    return new Promise((resolve, reject) => {
    function successCallback (envelope: any, response: any)  {
     const doc = xrxStringToDom(response);
     const info = xrxStringToDom((doc).find('devcfg\\:Information, Information').text());
     const generation = Number((info).find('style > generation').text());
     const model = (info).find('model').text();
     const isVersalink = _.includes(model.toLowerCase(), 'versalink') || _.includes(model.toLowerCase(), 'primelink');
     const isAltalink = _.includes(model.toLowerCase(), 'altalink');
     const isThirdGenBrowser = _.includes(navigator.userAgent.toLowerCase(), "x3g_");
     const result = {
        isThirdGenBrowser: isThirdGenBrowser,
        generation: generation,
        isVersalink: isVersalink,
        isAltalink: isAltalink,
        isEighthGen: generation < 9.0,
        model: model
        };
        localStorage.setItem('Device Info',result.toString());
        resolve(result);
      };
        function errorCallback  (result: any)  {
        reject(result);};
        xrxDeviceConfigGetDeviceInformation(
        url,
        successCallback,
        errorCallback,
        timeout,
        async
        );
      });
    
    }

  Session(url: string,timeout:number,async:boolean, ldap: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const successCallback = (envelope: string, response: string)=>  {
        var data = xrxSessionGetSessionInfoRequest(response);
        var userEmail = "";
        if (data !== null) {
          var userName = xrxGetElementValue(data, "username");
          if (userName !== null && userName.toLowerCase() !== 'guest')
            userEmail = xrxGetElementValue(data, "from");

          const result ={
            email:userEmail
          };
          resolve(result.email.toString());
        }
      };
      const errorCallback = (result: any) => {
        result={
          email:""
        };
        reject(result);
      };
      xrxSessionGetSessionInfo(
        url,
        successCallback.toString(),
        errorCallback.toString(),
        timeout,
        async,
        ldap
      );
    });
  }

  showPrivacyStatement(){
    //this.dialog.open(PrivacyPolicyComponent);
     this.modalService.openLargeModal(PrivacyPolicyComponent);
    //modalRef.content.closeBtnName = 'Close';
    //this.bsModalRef = this.modalService.show(PrivacyPolicyComponent);
  }

  get f():{[key: string]: AbstractControl}{
    return this.noteConvertorForm.controls;
  }
  }


