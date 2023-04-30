import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogViewComponent } from './src/app/views/log-view/log-view.component';

const routes: Routes = [
  { path: 'logs', component: LogViewComponent }
];

@NgModule({
    declarations: [],
  imports: [
    RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
