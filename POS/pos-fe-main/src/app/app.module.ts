import {
  APP_INITIALIZER,
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';

import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { PosComponent } from './pos/pos.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TableModule } from 'primeng/table';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { authInterceptorProviders } from 'src/services/auth/jwt.interceptor';
import { CustomerPopupCreateComponent } from './pos/customer-popup-create/customer-popup-create.component';
import { PosInvoidComponent } from './pos/pos-invoid/pos-invoid.component';
import { PrintCodeComponent } from './pos/barcode/print-code/print-code.component';
import { NgxPrintModule } from 'ngx-print';
import { ShowbarcodeComponent } from './pos/barcode/showbarcode/showbarcode.component';
import { ListBarcodeComponent } from './pos/barcode/list-barcode/list-barcode.component';
import { CloseSaleSessionComponent } from './pos/close-sale-session/close-sale-session.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { Configuration } from 'src/services/common/configuration';

export function initializeApp(appConfig: Configuration) {
  return () => appConfig.load();
}
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PosComponent,
    CustomerPopupCreateComponent,
    PosInvoidComponent,
    PrintCodeComponent,
    ShowbarcodeComponent,
    ListBarcodeComponent,
    CloseSaleSessionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    InputTextModule,
    ButtonModule,
    CheckboxModule,
    PasswordModule,
    AutoCompleteModule,
    TableModule,
    InputTextareaModule,
    RadioButtonModule,
    DropdownModule,
    ConfirmDialogModule,
    DynamicDialogModule,
    ToastModule,
    InputNumberModule,
    NgxPrintModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    ToastrModule.forRoot({}),
  ],
  providers: [
    authInterceptorProviders,
    ConfirmationService,
    MessageService,
    Configuration,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [Configuration],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
