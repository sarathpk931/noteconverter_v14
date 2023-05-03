import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LogService } from './log.service';
import { FileFormat,FileFormatOption} from '../model/common';

@Injectable({
  providedIn: 'root'
})

export class ScanOptionsService {

  const_fileFormat : string = "fileFormat";
  const_type : string = "type";
  const_size : string = 'size';

private fileFormat : FileFormat[] =[
  // Plex
  {
  name : "fileFormat",
  title: "SDE_FILE_FORMAT",
  icon: "file_name_and_format_48.png",
  options: [{
    value: 'docx',
    title: '.docx',
    icon: 'filetype_docx_48.png',
    isDefault: true
  }, {
    value: 'txt',
    title: '.txt',
    icon:'filetype_txt_48.png'
  }],
  subFeatures: [{
    name: 'archivalFormat',
    title: 'SDE_ARCHIVAL_PDFA',
enabledIf: 'pdf',
type: 'toggle',
options: [{
  value: false,
  isDefault: true,
}, {
  value: true
    }]
  }]
}];


private scanFeatures: FileFormat[]= [
  // Plex
  {
    name: 'plex',
    title: 'SDE_2SIDED_SCANNING',
    icon: '2_sided_48.png',
    options: [
      {
      value: 'ONE_SIDED',
      title: 'SDE_1SIDED',
      icon: '2_sided_1_48.png',
      isDefault: true,
    }, {
      value: 'TWO_SIDED',
      title: 'SDE_2SIDED',
       icon: '2_sided_2_48.png'
    }, {
      value: 'SECOND_SIDE_ROTATION',
      title: 'SDE_2SIDED_ROTATE_SIDE',
      icon: '2_sided_rotate_48.png',
    }],
    subFeatures: []
  },
  
  
  // Original Size
  {
    name: 'originalSize',
    title: 'SDE_ORIGINAL_SIZE',
    icon: 'original_size_48.png',
    options: [
      {
        value: 'AUTO',
        title: 'SDE_AUTO_DETECT',
        isDefault: true

      },
      {
        value: '8_5_x_11_Portrait',
        title:'8.5 x 11"',
        glyph:'xrx-portrait'
    
     },
     {
      value: '8_5_x_11_Landscape',
      title:'8.5 x 11"',
      glyph:'xrx-landscape'
    },
    {
      value: '8_5_x_14_Landscape',
      title:'8.5 x 14"',
      glyph:'xrx-landscape'
    },
    {
      value: '11_x_17_Landscape',
      title:'11 x 17"',
      glyph:'xrx-landscape'
    },
    {
      value: 'A4_Portrait',
      title:'A4',
      glyph:'xrx-portrait'
    },{
      value: 'A4_Portrait',
      title:'A4',
      glyph:'xrx-landscape'
    },
    {
      value: 'A3_Landscape',
      title:'A3',
      glyph:'xrx-landscape'
    }
    ],
    subFeatures: [] // define subfeatures here if needed 
  }];

  private selectedFileFormat : BehaviorSubject<FileFormatOption> = new BehaviorSubject(null);
  selectedFileFormatC = this.selectedFileFormat.asObservable();
  private selectedType : BehaviorSubject<FileFormatOption> = new BehaviorSubject(null);
  selectedTypeC = this.selectedType.asObservable();
  private selectedSize : BehaviorSubject<FileFormatOption> = new BehaviorSubject(null);
  selectedSizeC = this.selectedSize.asObservable();

  constructor(private logService: LogService) { }

  public resetFeatureSettings(): void {
    this.scanFeatures.forEach(feature => {
      this.setDefaults(feature);
    });
    this.setDefaults(this.fileFormat);
  }

  
  // Set defaults for each of the features (and the fileformat). We want these to be actual
  // object references because of how we manipulate them
  public setDefaults(feature: any): void {
    feature.subFeatures?.forEach(subFeature => {
      this.setDefaults(subFeature);

      if (feature.options) {
        feature.selectedOption = feature.options.find(option => option.isDefault);
      }
    });
  }

    getFileFormat(feature : any): FileFormat {
  
      if(feature.from == this.const_fileFormat)
      {
        return this.fileFormat[0];
      }
      else if (feature.from == this.const_type){
        return this.scanFeatures[0];
      }
      else if (feature.from == this.const_size){
        return this.scanFeatures[1];
      }
     return this.fileFormat[0];
    }

    setSelectedOption(option: FileFormatOption, param : any){
      
      let from : string = param.from;
      if(from == this.const_fileFormat)
      {
        this.selectedFileFormat.next(option);
      }
      else if (from == this.const_type){
        this.selectedType.next(option);
      }
      else if (from == this.const_size){
        this.selectedSize.next(option);
      }
    }
    //set selected value from pop up
    getSelectedOption( from : string){
debugger;
      if(from == this.const_fileFormat)
      {
        return this.selectedFileFormat;
      }
      else if (from == this.const_type){
        return this.selectedType;
      }
      else if (from == this.const_size){
        return this.selectedSize;
      }
      return this.selectedFileFormat;
    }

    getParentFileFormat(fileFormat: FileFormat,option:FileFormatOption){
      for(const formatOption of fileFormat.options){
        if(formatOption.value === option.value){
          return fileFormat;
        }
      }
      return null;
    }
}
