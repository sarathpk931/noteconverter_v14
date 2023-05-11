import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { ApiService } from './api.service';
import { LogService } from './log.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import {_scanSection,_generalSection,_destSec,_docSec} from '../../app/model/scantemplate.model';



@Injectable({
  providedIn: 'root'
})
export class ScanTemplateService {

  private readonly XRX_SCAN_TEMPLATE_RETURN = '\n\n\r';

  public readonly templateTypes = {

    'boolean': {
      values: ['TRUE', 'FALSE']
    },
    'enum_autoexposure': {
      supportsSimpleValidation: true,
      values: ['ON', 'OFF']
    },
    'enum_originalsubtype': {
      supportsSimpleValidation: true,
      values: ['PRINTED_ORIGINAL']
    },
    'integer': {
      validate: (v: any) => {
        const pattern = /^[0-9]*$/;
        return v.toString().match(pattern);
      },
      values: ['NUMBER (integer)']
    },
    'string': {
      format: (v: any) => {
        return "\"" + v + "\"";
      }
    },
    'enum_resolution': { //XBB-167 requires  200 dpi, 300 dpi, 400 dpi, 600 dpi 
      supportsSimpleValidation: true,
      values: ['RES_72X72', 'RES_150X150', 'RES_100X100', 'RES_200X200', 'RES_300X300', 'RES_400X400', 'RES_600X600']
    },
    'enum_colormode': {
      supportsSimpleValidation: true,
      values: ['AUTO', 'BLACK_AND_WHITE', 'GRAYSCALE', 'FULL_COLOR']
    },
    'enum_docformat': {
      supportsSimpleValidation: true,
      values: ['XSM_TIFF_V6', 'TIFF_V6', 'JFIF_JPEG', 'PDF', 'PDF/A-1b', 'XPS']
    },
    'enum_inputorientation': {
      supportsSimpleValidation: true,
      values: ['PORTRAIT', 'LANDSCAPE']
    },
    'enum_searchabletext': {
      supportsSimpleValidation: true,
      values: ['IMAGE_ONLY', 'SEARCHABLE_IMAGE']
    },
    'enum_imagemode': {
      supportsSimpleValidation: true,
      values: ['MIXED', 'PHOTO', 'TEXT', 'MAP', 'NEWSPAPER_AND_MAGAZINE']
    },
    'enum_sided': {
      supportsSimpleValidation: true,
      values: ['ONE_SIDED', 'TWO_SIDED', 'SECOND_SIDE_ROTATION']
    },
    'enum_mediasize': {
      supportsSimpleValidation: true,
      values: ['AUTO', 'NA_5.5x7LEF', 'NA_5.5x7SEF', 'NA_5.5x8.5LEF', 'NA_5.5x8.5SEF', 'NA_8.5x11LEF',
        'NA_8.5x11SEF', 'NA_8.5x13SEF', 'NA_8.5x14SEF', 'NA_11x17SEF',
        'ISO_A5LEF', 'ISO_A5SEF', 'ISO_A4LEF', 'ISO_A4SEF', 'ISO_A3SEF',
        'JIS_B4SEF', 'JIS_B5LEF', 'JIS_B5SEF']
    }
  };

  private _scanSection = {
    name: '[service xrx_svc_scan]',
    details: {
      AutoContrast: { type: 'boolean', value: 'FALSE' },
      AutoExposure: { type: 'enum_autoexposure', value: 'OFF' },
      CompressionQuality: { type: 'integer', value: 128 },
      Darkness: { type: 'integer', value: 0 },
      Contrast: { type: 'integer', value: 0 },
      OriginalSubType: { type: 'enum_originalsubtype', value: 'PRINTED_ORIGINAL' },
      InputEdgeErase: { type: 'struct_borders', value: '2/2/2/2/mm' },
      InputMediaSize: { type: 'enum_mediasize', value: 'AUTO' },
      InputOrientation: { type: 'enum_inputorientation', value: 'PORTRAIT' },
      Magnification: { type: 'struct_magnification', value: 'NONE' },
      Sharpness: { type: 'integer', value: 0 },
      Saturation: { type: 'integer', value: 0 },
      ColorMode: { type: 'enum_colormode', value: 'FULL_COLOR' },
      SidesToScan: { type: 'enum_sided', value: 'ONE_SIDED' },
      DocumentImageMode: { type: 'enum_imagemode', value: 'MIXED' },
      BlankPageRemoval: { type: 'enum_blankpageremoval', value: 'INCLUDE_ALL_PAGES' }
    }
  };

  private _generalSection = {
    name: '[service xrx_svc_general]',
    details: {
      DCSDefinitionUsed: { type: 'enum_DCS', value: 'DCS_GENERIC' },
      JobTemplateCharacterEncoding: { type: 'enum_encoding', value: 'UTF-8' },
      ConfirmationStage: { type: 'enum_confstage', value: 'AFTER_JOB_COMPLETE' },
      JobTemplateCreator: { type: 'string', value: 'scanTemplate.js' },
      SuppressJobLog: { type: 'boolean', value: 'TRUE' },
      JobTemplateLanguageVersion: { type: 'string', value: '4.00.07' },
      JobTemplateName: { type: 'string', value: '' }, // Random name of the template
      ConfirmationMethod: { type: 'enum_confmethod', value: 'NONE' }
    }
  };

  public _destSec = {
    name: '[service xrx_svc_file]',
    details: {
      RepositoryAlias: { type: 'string', value: 'AG_SCAN' },
      FilingProtocol: { type: 'enum_filingprotocol', value: 'XRXHTTP' },
      RepositoryVolume: { type: 'string', value: '//server/share' },
      RepositoryName: { type: 'string', value: 'DocLib' },
      DocumentPath: { type: 'string', value: '/Scan' },
      ServerValidationReq: { type: 'boolean', value: 'FALSE' },
      DocumentFilingPolicy: { type: 'enum_filingpolicy', value: 'NEW_AUTO_GENERATE' },
      XrxHTTPScriptLocation: { type: 'string', value: 'WebApp/Scan' },
      UserNetworkFilingLoginName: { type: 'string', value: '' },
      UserNetworkFilingLoginID: { type: 'string', value: '' }
    }
  };

  public _docSec = {
    name: '[doc_object xrx_document]',
    details: {
      DocumentFormat: { type: 'enum_docformat', value: 'PDF' },
      DocumentObjectName: { type: 'string', value: 'XeroxScan' },
      CompressionsSupported: { type: 'enum_compression', value: 'ANY' },
      MixedTypesSupported: { type: 'enum_mixedtype', value: 'MULTI_MASK_MRC, 3_LAYER_MRC' },
      MixedCompressionsSupported: { type: 'enum_mixedcompressions', value: 'ANY_BINARY, ANY_CONTONE' },
      Resolution: { type: 'enum_resolution', value: 'RES_300X300' },
      OutputImageSize: { type: 'enum_outputsize', value: 'SAME_AS_ORIGINAL' },
      UserData: { type: 'ref_invocation', value: '' }
    }
  };

  public docSection;
  public destSection;
  public generalSection;
  public scanSection;
  public sections;

  public name;

  constructor(
    private readonly location: Location,
    private readonly apiService: ApiService,
    private readonly logService: LogService,
    private http: HttpClient,
    private activatedRoute: ActivatedRoute
  ) { 
    

  }

   validateAgainstArray(v: any, arr: any[]): any {
    return arr.find(d => d === v);
  }

   scanTemplate(featureValues) {
    var scriptLocation = "/api/v1/jobs/scan";
    var repoName = location.host;
  
    // Add properties from the section templates
    this.docSection = _.clone(typeof(this._docSec));
    this.destSection = _.clone(typeof(this._destSec));
    this.generalSection = _.clone(typeof(this._generalSection));
    this.scanSection = _.clone(typeof(this._scanSection));
    this.sections = [this.scanSection, this.generalSection, this.destSection, this.docSection];
  debugger;
    var params = this.activatedRoute.queryParamMap.subscribe((params) => {
      console.log(params);
    });
  
    // Assign properties from incoming options
  
    // Destination
    this.logService.logMsg('scanTemplate => featureValues.jobid:' + featureValues.jobid, 'information');
  
    var returnUrl = this.apiService.getPrefix() + scriptLocation + '?' + 'jobId=' + featureValues.jobid;
  
    this.destSection.details.XrxHTTPScriptLocation.value = returnUrl;
  
    repoName = this.apiService.apiHost();
  
    this.destSection.details.DocumentPath.value = '/';
    this.destSection.details.RepositoryName.value = repoName;
  
    // Resolution
    this.docSection.details.Resolution.value = featureValues.resolution;
  
    // Scan settings   
    this.scanSection.details.SidesToScan.value = featureValues.plex;
    this.scanSection.details.InputOrientation.value = featureValues.orientation;
    this.scanSection.details.CompressionQuality.value = featureValues.quality;
    this.scanSection.details.ColorMode.value = featureValues.colorMode;
    this.scanSection.details.InputMediaSize.value = featureValues.mediaSize;
    this.scanSection.details.DocumentImageMode.value = featureValues.originalType;
  
    // File Name
    this.docSection.details.DocumentObjectName.value = featureValues.fileName;
  
    // Template name
    this.name = "Xerox_WNC" + new Date().getTime() + ".xst";
    this.generalSection.details.JobTemplateName.value = this.name;
  
    
  }

  toString(): string {
    const _sectionStrings: string[] = [];

    for (let index = 0; index < this.sections.length; index++) {
        const section = this.sections[index];

        let sectionString = section.name + this.XRX_SCAN_TEMPLATE_RETURN;

        // handle's multiple destinations
        if (section.name == this._destSec.name && Array.isArray(section.details)) {
            section.details.forEach((detail, index) => {
                sectionString += "file_" + (index + 1) + this.transformObjectToTemplateSection(detail);
            });
        } else {
            sectionString += this.transformObjectToTemplateSection(section.details);
        }

        _sectionStrings.push(sectionString);
    }

    // Join them all up.
    return _sectionStrings.join('end' + this.XRX_SCAN_TEMPLATE_RETURN) + 'end' + this.XRX_SCAN_TEMPLATE_RETURN;
}

 transformObjectToTemplateSection(details: any): string {
  // Perform transformations on details object
  let sectionString = '{' + this.XRX_SCAN_TEMPLATE_RETURN;

  // Get the values of the template.
  Object.keys(details).forEach(function (detail) {
    const typeName = details[detail].type;
    let typeValue = details[detail].value;

    // Get the formatting function.
    const fun = this.templateTypes[typeName];

    // Can we validate?
    if (fun) {

      // Do we have a validation function? If not we might be able to use the simple validation function.
      const validateFunction = fun.validate ||
        ((fun.supportsSimpleValidation && fun.supportsSimpleValidation == true) ? this.validateAgainstArray : null);

      if (validateFunction && !validateFunction(typeValue, fun.values))
        throw new this.ScanTemplateFormatException(typeValue, detail, this.templateTypes[typeName].values);
    }

    // Reformat if necessary.
    if (fun && fun.format) {
      typeValue = fun.format(typeValue);
    }

    // Format the entry
    sectionString += '\t' +
      typeName + ' ' +
      detail + ' = ' +
      typeValue + ';' +
      this.XRX_SCAN_TEMPLATE_RETURN;
  });

  sectionString += '}' + this.XRX_SCAN_TEMPLATE_RETURN;
  return sectionString;

  //return JSON.stringify(details);
}
  

scanTemplateFormatException(value: any, propName: string, acceptableValues: Array<any>): string {
  return "The scan template is invalid. The property: " + propName +
    " is invalid. The acceptable values are: " + acceptableValues.join(',');
}


/* export class ScanTemplateFormatException extends Error {
  value: any;
  acceptableValues: any[];
  propName: string;

  constructor(value: any, propName: string, acceptableValues: any[]) {
    super();
    this.name = 'ScanTemplateFormatException';
    this.value = value;
    this.acceptableValues = acceptableValues;
    this.propName = propName;
  }

  toString(): string {
    return `The scan template is invalid. The property: ${this.propName} is invalid. The acceptable values are: ${this.acceptableValues.join(',')}.`;
  }
}
 */

}
