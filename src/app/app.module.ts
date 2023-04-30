import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatDialogModule } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { AppInitializerProvider } from './app-init';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';

import {LogService} from '../app/services/log.service';
import {StorageService} from '../app/services/storage.service';

import {LogViewComponent} from '../app/views/log-view/log-view.component';

@NgModule({
  declarations: [
    AppComponent,
    LogViewComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    AppInitializerProvider,
    StorageService,
    LogService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
