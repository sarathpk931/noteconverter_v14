import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogViewComponent } from '../app/views/log-view/log-view.component';
import {PopupCompComponent} from '../app/views/popup-comp/popup-comp.component';
import {ScanScreenComponent} from '../app/views/scan-screen/scan-screen.component';
import { PrivacyPolicyComponent } from './views/privacy-policy/privacy-policy.component';

const routes: Routes = [
  {path: 'logs', component: LogViewComponent },
  {path:'popUp',component: PopupCompComponent},
  {path:'scanScreen',component: ScanScreenComponent},
  {path:'privacyPolicy',component:PrivacyPolicyComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
