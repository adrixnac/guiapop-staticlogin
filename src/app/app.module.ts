import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AutenticacionComponent } from './view/login/autenticacion/autenticacion.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxSpinnerModule } from "ngx-spinner";
import { CaptchaComponent } from './common/captcha/captcha.component';
import { StoreModule } from '@ngrx/store';
import { appReducer } from './app.reducer';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { ModalInfoComponent } from './common/shared/modal-info/modal-info.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DemoMaterialModule } from './material-module';
import { ToastrModule } from 'ngx-toastr';
import { JwtInterceptor } from './common/interceptor/jwt.interceptor';
import { ConfirmModalComponent } from './common/shared/confirm-modal/confirm-modal.component';
import { AsignacionesComponent } from './view/login/asignaciones/asignaciones.component';
import { MainMenuComponent } from './view/main-menu/main-menu.component';
import { SystemSelectionComponent } from './view/system-selection/system-selection.component';
import { SelectionRolModalComponent } from './common/shared/selection-rol-modal/selection-rol-modal.component';



@NgModule({
  declarations: [
    AppComponent,
    AutenticacionComponent,
    CaptchaComponent,
    ModalInfoComponent,
    ConfirmModalComponent,
    AsignacionesComponent,
    MainMenuComponent,
    SystemSelectionComponent,
    SelectionRolModalComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    StoreModule.forRoot(appReducer),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
    BrowserAnimationsModule,
    DemoMaterialModule,
    ToastrModule.forRoot(),
  ],
  providers: [{
    provide:HTTP_INTERCEPTORS,
    useClass:JwtInterceptor,
    multi:true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
