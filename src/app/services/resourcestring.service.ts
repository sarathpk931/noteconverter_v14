import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { resourceString } from '../model/global';
import {environment} from  '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ResourcestringService {

  objStrings : resourceString[] = [];
  private objString : resourceString = {};
  env = environment;

  constructor(    private http: HttpClient,) { }

loadResources = async () => { 
    try { 
        var regex = /(\w+)\-?/g; 
        const locale = regex.exec(window.navigator.language || window.navigator.language)[1] || 'en-US'; 
        const result: any = await this.http.get(this.env.wncAppAddress + `/api/strings?lang=${encodeURIComponent(locale)}`).toPromise(); 
        this.objStrings = result.strings; 
        console.log(this.objStrings );
        return result.strings; 
      } 
        catch (error) { 
         
        } 
      };

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
