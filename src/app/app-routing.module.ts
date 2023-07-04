import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogViewComponent } from '../app/views/log-view/log-view.component';
import {ScanScreenComponent} from '../app/views/scan-screen/scan-screen.component';

const routes: Routes = [
  {path: 'logs', component: LogViewComponent },
  {path:'scanScreen',component: ScanScreenComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
