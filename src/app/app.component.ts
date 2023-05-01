import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { PopupCompComponent } from '../app/views/popup-comp/popup-comp.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { xrxDeviceConfigGetDeviceInformation } from '../assets/Xrx/XRXDeviceConfig';
import {xrxStringToDom} from '../assets/Xrx/XRXXmlHandler';
import {xrxSessionGetSessionInfo,xrxSessionGetSessionInfoRequest}  from  '../assets/Xrx/XRXSession';
import {xrxGetElementValue} from '../assets/Xrx/XRXXmlHandler';
import {xrxCallWebservice,xrxCallAjax} from '../assets/Xrx/XRXWebservices';
import { LogService } from '../app/services/log.service';
import {ModalService} from '../app/services/modal.service';
import { PrivacyPolicyComponent } from '../app/views/privacy-policy/privacy-policy.component';

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

  constructor(
    
    private modalService:ModalService, 
    private  logger: LogService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    ) 
    {this.Strings();this.Device('http://localhost',5000,true);this.Session('http://127.0.0.1',5000,true,'');}

  
  ngOnInit(){
    this.createForm();
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
      const successCallback = (envelope: any, response: any) => {
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
        resolve(result);
      };
      const errorCallback = (result: any) => {
        reject(result);
      };
      xrxDeviceConfigGetDeviceInformation(
        url,
        successCallback.toString(),
        errorCallback.toString(),
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
  }


