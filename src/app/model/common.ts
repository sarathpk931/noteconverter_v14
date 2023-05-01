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

export class Common {
}