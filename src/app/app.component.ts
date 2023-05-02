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
import { xml2js } from 'xml-js';


declare const _: any;

let Deviceconfigxmlresponse:string;

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
    {//this.Strings();
      //this.Device('http://localhost',5000,true);
      //this.Session('http://127.0.0.1',5000,true,'');
      this.parsedeviceinfoxml();
    }

    
  
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

  
  Deviceconfigxmlresponse ='<DeviceInformation> <schemaVersion><MajorVersion>1</MajorVersion><MinorVersion>4</MinorVersion><Revision>6</Revision></schemaVersion><device><name>nwood202</name><mac>00:00:aa:fa:14:3f</mac><serial>128dfb4f-c218-4755-a294-6f70b4832e43</serial><model>XeroxWorkCentre7525v1MultifunctionSystem</model></device><display><canvasSize><width>800</width><height>480</height></canvasSize><touchable><offset><width>0</width><height>0</height></offset><region><width>800</width><height>480</height></region></touchable><iconSize><small><width>48</width><height>48</height></small><tools><width>0</width><height>0</height></tools></iconSize><dpi>110</dpi><bitdepth>16</bitdepth><colorspace>color</colorspace><dotPitch>.231</dotPitch><physical><totalResolution><width>800</width><height>480</height></totalResolution><size>8.5"</size><aspectRatio>5:3</aspectRatio></physical></display><style><generation>7.8</generation><colorPalette><name>HighColor</name></colorPalette></style><invocationPoints><serviceSelectButton><name>ServiceSelectButtonA</name><label><font><family>XeroxSansSerif</family><size>11</size></font><numberOfLines>2</numberOfLines><justification>centered</justification><locale>onBottom</locale></label><icon><size><width>48</width><height>48</height></size></icon></serviceSelectButton><serviceSelectButton><name>ServiceSelectButtonB</name><label><font><family>XeroxSansSerif</family><size>15</size></font><numberOfLines>2</numberOfLines><justification>centered</justification><locale>onBottom</locale></label><icon><size><width>96</width><height>96</height></size></icon></serviceSelectButton><serviceSelectButton><name>ServiceSelectButtonC</name><label><font><family>XeroxSansSerif</family><size>17</size></font><numberOfLines>2</numberOfLines><justification>centered</justification><locale>onBottom</locale></label><icon><size><width>128</width><height>128</height></size></icon></serviceSelectButton></invocationPoints><webUI><version><systemSoftware>061.121.221.28308</systemSoftware><uiSoftware>061.121.24120</uiSoftware><netControllerSoftware>061.121.25025</netControllerSoftware><eipSoftware><majorVersion>2</majorVersion><minorVersion>5</minorVersion><revision>0</revision></eipSoftware><registrationWS><majorVersion>1</majorVersion><minorVersion>5</minorVersion><revision>0</revision></registrationWS><sessionWS><majorVersion>1</majorVersion><minorVersion>0</minorVersion><revision>2</revision></sessionWS><scanWS><majorVersion>1</majorVersion><minorVersion>1</minorVersion><revision>0</revision></scanWS><accessConfigWS><majorVersion>1</majorVersion><minorVersion>1</minorVersion><revision>0</revision></accessConfigWS><uiConfigWS><majorVersion>1</majorVersion><minorVersion>2</minorVersion><revision>0</revision></uiConfigWS><connectivityConfigWS><majorVersion>1</majorVersion><minorVersion>1</minorVersion><revision>0</revision></connectivityConfigWS><securityConfigWS><majorVersion>1</majorVersion><minorVersion>2</minorVersion><revision>1</revision></securityConfigWS><scanTemplateMgmtWS><majorVersion>1</majorVersion><minorVersion>1</minorVersion><revision>0</revision></scanTemplateMgmtWS><convenienceAuthWS><majorVersion>1</majorVersion><minorVersion>0</minorVersion><revision>0</revision></convenienceAuthWS><copyWS><majorVersion>1</majorVersion><minorVersion>0</minorVersion><revision>0</revision></copyWS><massStorageWS><majorVersion>1</majorVersion><minorVersion>0</minorVersion><revision>0</revision></massStorageWS><cardReaderWS><majorVersion>1</majorVersion><minorVersion>0</minorVersion><revision>0</revision></cardReaderWS><jobManagementWS><majorVersion>1</majorVersion><minorVersion>0</minorVersion><revision>0</revision></jobManagementWS><jobLimitsWS><majorVersion>1</majorVersion><minorVersion>0</minorVersion><revision>0</revision></jobLimitsWS><jobLimitsDeviceClientWS><majorVersion>1</majorVersion><minorVersion>0</minorVersion><revision>0</revision></jobLimitsDeviceClientWS><convenienceAuthClientWS><majorVersion>1</majorVersion><minorVersion>0</minorVersion><revision>0</revision></convenienceAuthClientWS><offboxValidationClientWS><majorVersion>1</majorVersion><minorVersion>0</minorVersion><revision>7</revision></offboxValidationClientWS><SendCardDataDeviceClientWS><majorVersion>1</majorVersion><minorVersion>0</minorVersion><revision>0</revision></SendCardDataDeviceClientWS><sessionSchema>http://schemas.xerox.com/office/cui/sessioninformation/1</sessionSchema><deviceInformationSchema>http://schemas.xerox.com/office/cui/deviceinformation/1</deviceInformationSchema><deviceTextSchema>http://schemas.xerox.com/office/cui/displaytext/1</deviceTextSchema><accessConfigSchema><MajorVersion>1</MajorVersion><MinorVersion>0</MinorVersion><Revision>4</Revision></accessConfigSchema><SendCardDataSchema><MajorVersion>1</MajorVersion><MinorVersion>0</MinorVersion><Revision>0</Revision></SendCardDataSchema><DeviceInfo><MajorVersion>1</MajorVersion><MinorVersion>4</MinorVersion><Revision>6</Revision></DeviceInfo><DirectoryListingSchema><MajorVersion>1</MajorVersion><MinorVersion>0</MinorVersion><Revision>0</Revision></DirectoryListingSchema><JobLimitsDeviceClientSchema><MajorVersion>1</MajorVersion><MinorVersion>0</MinorVersion><Revision>9</Revision></JobLimitsDeviceClientSchema><JobLimitsSchema><MajorVersion>1</MajorVersion><MinorVersion>0</MinorVersion><Revision>8</Revision></JobLimitsSchema><JobModelSchema><MajorVersion>1</MajorVersion><MinorVersion>0</MinorVersion><Revision>16</Revision></JobModelSchema><JobModelCapabilitiesSchema><MajorVersion>1</MajorVersion><MinorVersion>0</MinorVersion><Revision>5</Revision></JobModelCapabilitiesSchema><PartitionsInfoSchema><MajorVersion>1</MajorVersion><MinorVersion>0</MinorVersion><Revision>0</Revision></PartitionsInfoSchema><PeripheralsInfoSchema><MajorVersion>1</MajorVersion><MinorVersion>0</MinorVersion><Revision>0</Revision></PeripheralsInfoSchema><SessionInfoSchema><MajorVersion>1</MajorVersion><MinorVersion>1</MinorVersion><Revision>1</Revision></SessionInfoSchema></version></DeviceInformation>';
  
  parsedeviceinfoxml()
  {
    debugger;
    var parser =new DOMParser();
    var xmldoc = parser.parseFromString(Deviceconfigxmlresponse,'text/xml');
    console.log(xmldoc);
    document.getElementById('DeviceInformation');
  }

}


