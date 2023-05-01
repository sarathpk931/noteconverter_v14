import { Component,OnInit,Renderer2,ElementRef, EventEmitter,Input,Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialogRef } from '@angular/material/dialog';
//import { DomSanitizer, SafeHtml} from '@angular/platform-browser';
//import {  BsModalRef } from 'ngx-bootstrap/modal';
import { ModalService} from '../../services/modal.service';


@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {

  privacyPolicy : string = '';
  showVersion: string = '';
  //sanitizedHtmlContent : SafeHtml;

 

  constructor(private http: HttpClient,private modalService : ModalService,public modalRef : MatDialogRef<any>){}

  ngOnInit(): void {
    const progress = this.modalService.showProgressAlert('Alert','');
    const url ='https://appgallery.services.xerox.com/api/apps/template-privacy-policy';
    this.http
      .get(url, {responseType:'text'
      })
      .subscribe({
        next:(response) => {
          this.privacyPolicy = (response as string);
          console.log(this.privacyPolicy);
          
        },
        error:(error) => {
          this.showVersion = 'v1.0'; //this.strings.VERSION
          progress.close();
          //this.modalService.showGeneralError(error);
        }
    });
    }
      
    closeModal():void{
      this.modalService.closeModal(this.modalRef);
    }

    private disableLinks(): void {
      const links = document.getElementsByTagName('a');
      for (let i = 0; i < links.length; i++) {
        links[i].style.pointerEvents = 'none';
      }
    }
  /* disableLinks() :void{
    const links  = this.el.nativeElement.querySelectorAll('a');
     links.array.forEach(link => {
      this.renderer.setStyle(link,'pointer-events','none');
    });
  } */
}
  


