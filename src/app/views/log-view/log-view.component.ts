import { Component } from '@angular/core';
import { LogService } from '../../services/log.service';

@Component({
  selector: 'app-log-view',
  templateUrl: './log-view.component.html',
  styleUrls: ['./log-view.component.scss']
})
export class LogViewComponent {
  
  

  constructor(private logger: LogService) {
    
  }

  throwError() {
    try {
      throw new Error('This is a test error');
    } catch (error) {
      this.logger.log(error);
    }
  } 
  
}
