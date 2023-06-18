import { Component } from '@angular/core';
import { LogService } from '../../services/log.service';

@Component({
  selector: 'app-log-view',
  templateUrl: './log-view.component.html',
  styleUrls: ['./log-view.component.less']
})
export class LogViewComponent {

  constructor(private logger: LogService) {
    
  }
  
}
