import { Component, OnInit } from '@angular/core';
//import { UseApiRequests } from '../services/freeapiservices';
import {MatDialog} from '@angular/material/dialog';
import { PopupCompComponent } from '../app/views/popup-comp/popup-comp.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { LogService } from '../services/log.service';

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
    //private UseApi: UseApiRequests,
    private  logger: LogService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    ) {

      this.generateNewJobID();

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

  generateNewJobID() {
    const guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);

    //this.log.debug('Inside generateNewJobID method ',r);

      return v.toString(16);
    });
    return guid;
  }

  }


