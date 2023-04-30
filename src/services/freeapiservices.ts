import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
    providedIn: 'root',
  })
export class UseApiRequests {
    constructor(
        private httpService:HttpClient
    ){}
    // async getImages() {
    //     const getImages = await fetch('https://picsum.photos/v2/list');
    //     const data = await getImages.json();
    //     return data;
    // }
    // getphotos(url:string){
    //    return this.httpService.get(url);
    // }
    // getTest(){
    //     // return this.httpService.get('https://nishant-xerox-poc-bacnkend.onrender.com/');
    //     return this.httpService.get('http://localhost:3030/');
        
    // }
    saveFileLocaly(body){
        return this.httpService.post('https://nishant-xerox-poc-bacnkend.onrender.com/upload',body);
    }
}