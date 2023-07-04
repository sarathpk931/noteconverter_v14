/**
 * Privacy Policy Component
 *
 * Description: This component is used to show the privacy policy
 *
 * Usage:
 * <app-privacy-policy></app-privacy-policy>
 *
 *
 * Outputs:
 * - A pop up will be shown with privacy policy.
 *
 */
import { Component,OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialogRef } from '@angular/material/dialog';

import { ModalService} from '../../services/modal.service';
import { ResourcestringService} from '../../services/resourcestring.service';
import { LogService } from '../../services/log.service';

import { environment } from '../../../environments/environment';
import { resourceString} from '../../model/global';
import { ProgressAlertComponent } from '../progress-alert/progress-alert.component';

import smoothscroll from 'smoothscroll-polyfill';


@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.less']
})
export class PrivacyPolicyComponent implements OnInit {

  privacyPolicy : string = '';
  showVersion: string = '';
  env = environment;
  resourceString : resourceString[];
  //declare smoothscroll : any;

  constructor(
    private http: HttpClient,
    private modalService : ModalService,
    public modalRef : MatDialogRef<any>,
    private resourceStringService : ResourcestringService,
    private  logService: LogService,
    ){}

  ngOnInit(): void {
    
    const progress =  this.modalService.openModalWithoutClose(ProgressAlertComponent,'','');
    const url = this.env.privacyPolicyUrl;
    //this.smoothscroll.polyfill();
    //smoothscroll.polyfill();
       
    //element.scrollIntoView({behavior : 'smooth'});

    this.http.get(url, {responseType:'text'})
      .subscribe({
          next:(response) => {
          this.privacyPolicy = (response as string);
          //this.showVersion = this.resourceString["VERSION"];
          progress.close();
        },
        error:(error) => {
          this.logService.trackTrace("inside privacy policy error"+error);
          this.showVersion = 'v1.0'; //this.strings.VERSION
          progress.close();
          //this.modalService.showGeneralError(error);
        }
    });

    }
      
    closeModal():void{
      this.modalService.closeModal(this.modalRef);
    }

    /* private disableLinks(): void {
      const links = document.getElementsByTagName('a');
      for (let i = 0; i < links.length; i++) {
        links[i].style.pointerEvents = 'none';
      }
    } */
  /* disableLinks() :void{
    const links  = this.el.nativeElement.querySelectorAll('a');
     links.array.forEach(link => {
      this.renderer.setStyle(link,'pointer-events','none');
    });
  } */
}
  


