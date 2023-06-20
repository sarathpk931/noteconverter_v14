import {  Directive, ElementRef, HostListener, Input, OnInit,Renderer2,Inject,HostBinding } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { FileFormat, FileFormatOption} from '../model/global';

import { ScanOptionsService} from '../services/scan-options.service';




@Directive({

  selector: '[editableField]'

})

export class EditableFieldDirective {




  @Input() placeholder: string;

  @Input() additionalText : string;





  private defaultText: string;

  private isPlaceholderVisible = true;

  private inputPlaceholder : string;

  selectedFileFormat : FileFormat;

  selectedFileFormatOptions : FileFormatOption;

  anyFileFormat = {from : 'fileFormat'};

  extension : string;

  tempTextValue : string = '';




  @HostBinding('value') value: string;

  @HostBinding('readonly') isReadonly: boolean;

  @HostBinding('class') hostClasses = '';




  private editing: boolean = false;

  renderer : Renderer2;

 

  constructor(

    private elementRef: ElementRef<HTMLInputElement>,

    private scanOptionService : ScanOptionsService,

    ) {}




ngOnInit(){




  this.selectedFileFormat = this.scanOptionService.getFileFormat(this.anyFileFormat);

  this.selectedFileFormatOptions = this.selectedFileFormat.options.find(item => item.isDefault === true);

  this.extension = this.selectedFileFormatOptions.title;

  this.extension = this.extension.replace('.','');

  this.defaultText = this.placeholder;

  var newValue : string = '';

  newValue =   this.additionalText ;

  newValue = newValue.replace('{0}', (this.placeholder || ''));

  newValue = newValue.replace('{1}', this.extension);




  this.value = newValue;

  this.inputPlaceholder = this.defaultText;

  this.isReadonly = true;




  this.scanOptionService.selectedFileFormatC.subscribe(object =>{

    if(object){

      this.selectedFileFormatOptions = object;

      this.extension = this.selectedFileFormatOptions.title;

      //this.extension = this.extension.replace('.','');

      if(this.value.includes('.')){

        this.value = this.value.substring(0,this.value.lastIndexOf('.')) + this.extension;

      }

    }

  })




}




  @HostListener('click') onClick() {




    //var extraText = this.additionalText;//alert(extraText);

    var newValue : string = '';

     

    // if(this.value.endsWith(this.additionalText)){

    //   this.value = this.value.substring(0,this.value.length - this.additionalText.length);

    // }




    if(this.isPlaceholderVisible){

      this.value = this.placeholder;

      this.inputPlaceholder = '';

      this.isPlaceholderVisible = true;

    }

    else{

      //this.extension = this.selectedFileFormatOptions.title;

      //this.extension = this.extension.replace('.','');

      //newValue =   this.additionalText ;//

      //newValue = newValue.replace('{0}', this.tempTextValue);

      //newValue = newValue.replace('{1}', this.extension);

      this.value = this.tempTextValue;

      this.isPlaceholderVisible = false;

      // if(this.value.endsWith(extraText)){

      //   this.value = this.value.substring(0,this.value.length - (extraText.length));

      // }

    }

   




    this.isReadonly = false;

    this.hostClasses = 'selected';

    this.elementRef.nativeElement.select();

  }

  @HostListener('blur') onBlur() {  

    var enteredValue = this.elementRef.nativeElement.value.trim();

    this.tempTextValue = enteredValue;

    this.extension = this.selectedFileFormatOptions.title;

    this.extension = this.extension.replace('.','');

    newValue =   this.additionalText ;

    newValue = newValue.replace('{1}', this.extension);




    if(enteredValue == this.placeholder){

      this.inputPlaceholder = this.defaultText;

      newValue = newValue.replace('{0}', this.defaultText);

      this.isPlaceholderVisible = true;

      this.value = newValue;

    }

    else{

      this.inputPlaceholder = '';

      var newValue : string;

      this.value = '';

         

      newValue = newValue.replace('{0}', enteredValue);

      this.value =  newValue;

      this.isPlaceholderVisible = false;

    }

    this.isReadonly = true;

    this.hostClasses = '';

  }



}