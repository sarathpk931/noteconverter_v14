import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {Router} from '@angular/router';

import { MatDialogModule,MatDialogRef } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { AppInitializerProvider } from './app-init';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';

import {LogService} from '../app/services/log.service';
import {StorageService} from '../app/services/storage.service';
import {ScanOptionsService} from '../app/services/scan-options.service';
import {ErrorHandlerService} from '../app/services/error-handler.service';


import { PrivacyPolicyComponent } from './views/privacy-policy/privacy-policy.component';
import { ProgressAlertComponent } from './views/progress-alert/progress-alert.component';
import { FeaturePopoverComponent } from './views/feature-popover/feature-popover.component';
/* 
import { AlertBannerComponent } from './views/alert-banner/alert-banner.component';
import { BasicAlertComponent } from './views/basic-alert/basic-alert.component';

import { FileFormatModalComponent } from './views/file-format-modal/file-format-modal.component';
import { GeneralAlertComponent } from './views/general-alert/general-alert.component';
import { KeypadComponent } from './views/keypad/keypad.component';


import { ProgressBannerComponent } from './views/progress-banner/progress-banner.component';
import { SpinBoxComponent } from './views/spin-box/spin-box.component';
import { ToggleSwitchComponent } from './views/toggle-switch/toggle-switch.component';
import { ImagePreviewerComponent } from './views/image-previewer/image-previewer.component';
import { LogoutConfirmationComponent } from './views/logout-confirmation/logout-confirmation.component'; */
import { GeneralAlertComponent } from '../app/views/general-alert/general-alert.component';
import {LogViewComponent} from '../app/views/log-view/log-view.component';
import {XasStringDirective} from '../app/Directives/xas-string.directive';

//pipes

import { ParseSnmpPipe } from './filters/parse-snmp.pipe';
import { OrderObjectByPipe } from './filters/order-object-by.pipe';
import { ErrorPipe } from './filters/error.pipe';
import { ParseDeviceCapabilitiesPipe } from './filters/parse-device-capabilities.pipe';
import { ParseDevicePrintCapabilitiesPipe } from './filters/parse-device-print-capabilities.pipe';
import { IsUserDeviceAdminPipe } from './filters/is-user-device-admin.pipe';
import { ConvertProtocolPipe } from './filters/convert-protocol.pipe';
import { PasswordMaskPipe } from './filters/password-mask.pipe';
import { StringFormatPipe } from './filters/string-format.pipe';
import { TranslatePipe } from './filters/translate.pipe';
import { ParseDeviceConfigPipe } from './filters/parse-device-config.pipe';
import { ModalService } from './services/modal.service';
import { ScanScreenComponent } from './views/scan-screen/scan-screen.component';

@NgModule({
  declarations: [
    AppComponent,
    LogViewComponent,
    PrivacyPolicyComponent,
    ProgressAlertComponent,
    ScanScreenComponent,
    FeaturePopoverComponent,
    XasStringDirective,
    GeneralAlertComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    AppInitializerProvider,
    StorageService,
    LogService,
    ModalService,
    ScanOptionsService,
    AppComponent,
    ErrorHandlerService
    
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
