import { Component,OnInit,Renderer2,ElementRef, EventEmitter,Input,Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//import { DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {  BsModalRef } from 'ngx-bootstrap/modal';
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

 

  constructor(private http: HttpClient,private renderer: Renderer2, private el : ElementRef,
      private modalService : ModalService, public bsModalRef : BsModalRef){}
//, private sanitizer: DomSanitizer
  ngOnInit(): void {
     
      const url = "https://appgallery.services.xerox.com/api/apps/template-privacy-policy";//,{params:{timeout: 10}}
      this.http.get(url,{responseType : 'text'})
      .subscribe({
        
        next : (response)=> {
         //debugger;
           this.privacyPolicy = (response as any);
           console.log(this.privacyPolicy);
           //this.sanitizedHtmlContent = this.sanitizer.bypassSecurityTrustHtml(this.privacyPolicy);
         
          // this.showVersion =  "v1.0";//strings.VERSION
          // progress.close();
           //setTimeout(this.disableLinks,250);
        },
        error: (error) => {
          debugger;
           this.showVersion = "v1.0";//strings.VERSION;
          // progress.close();
          //modalService.showGeneralError(error);
        }
      });
    }
          

    closeModal():void{
      this.modalService.closeModal(this.bsModalRef);
    }

  disableLinks() :void{
    const links  = this.el.nativeElement.querySelectorAll('a');
     links.array.forEach(link => {
      this.renderer.setStyle(link,'pointer-events','none');
    });
  }
}
  


