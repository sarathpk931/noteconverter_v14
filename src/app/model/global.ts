export interface FileFormat {
    name : string;
    title : string;
    icon: string;
    options : FileFormatOption[];
    subFeatures?: FileFormatSubFeature[];
}

export interface FileFormatOption {
    value: string;
    title: string;
    icon?: string;
    isDefault?: boolean;
    glyph? : string;
}

export interface FileFormatSubFeature{
name: string;
title: string;
enabledIf: string;
type: string;
options: FileFeatureSubFeatureOption[];
}

export interface FileFeatureSubFeatureOption {
    value: boolean;
    isDefault?: boolean;
}

export interface selectedNote{
    fileFormat : FileFormatOption,
    size       : FileFormatOption,
    type       : FileFormatOption,
    email      : string,
    fileName   : string
}

export interface ScanFeatureOption {
    value: string;
    title: string;
    icon?: string;
    glyph?: string;
    isDefault?: boolean;
}

export interface ScanFeature {
    name: string;
    title: string;
    icon: string;
    options: ScanFeatureOption[];
}
  
export class Global {

    public static Email:string;
    public static Generation:string;
    public static isThirdGenBrowser:string;
    public static isVersaLink:string;
    public static isAltaLink:string;
    public static isEighthGen:string;
    public static Model:string
}

export class AppSetting {

    public static  url:'http://localhost';
    public static timout:5000;
    public static async:true;
    public static ldap:'';
   
}

export interface DialogData {
    title: string;
    message: string;
  }

  export interface DialogDataObject  {
    title: string,
    additionalInfo: string,
    additionalInfo2:string,
    button1Callback:any,
    button2Callback:any,
    button1Glyph?:string,
    button2Glyph?:string,
    button1Text? : string,
    button2Text? : string
  };

  export interface resourceString{
    
        [key:string]:string;
    
  }