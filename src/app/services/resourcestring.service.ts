import { Injectable } from '@angular/core';
import { resourceString } from '../model/global';

@Injectable({
  providedIn: 'root'
})
export class ResourcestringService {

  objStrings : resourceString[] = [];
  private objString : resourceString = {};

  constructor() { }

  processApiResponse(response: resourceString): void {
    const strings = response;

    for(const key in strings){

      if(strings.hasOwnProperty(key)){

        const value = strings[key];

        const objString = {

          
            [key]:value
        }

        this.objStrings.push(objString);

      }
    }
  }

  getObjStrings(): resourceString[]{
    return this.objStrings;
  }

  getValueByKey(key:string):string{
    return this.objStrings[key] || '';
  }
}
