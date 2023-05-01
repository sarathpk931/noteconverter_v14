import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogViewComponent } from '../app/views/log-view/log-view.component';
import {PopupCompComponent} from '../app/views/popup-comp/popup-comp.component';

const routes: Routes = [
  {path: 'logs', component: LogViewComponent },
  {path:'popUp',component: PopupCompComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
