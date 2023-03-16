import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, LOCALE_ID, NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TopNavBarComponent } from './top-nav-bar/top-nav-bar.component';
import { InfoBarComponent } from './info-bar/info-bar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpConfigInterceptor } from './interceptor/interceptor.interceptor';
import { PermissionsModule } from './shared/module/shared/permissions.module';
import { SnackBarModule } from "@tbc-common/snack-bar";
import { DateInputsModule } from "@progress/kendo-angular-dateinputs";
import { registerLocaleData } from "@angular/common";
import localeKa from '@angular/common/locales/ka'

registerLocaleData(localeKa);

import '@progress/kendo-angular-intl/locales/ka/calendar';
import { GlobalErrorHandler } from "./handler/global-error-handler";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { IsLoadingService } from "./services/is-loading.service";
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { WrapperComponent } from "./features/wrapper/wrapper.component";
import { PermissionsResolver } from "./resolver/permissions.resolver";
import { AccountClient } from "./services/admin.api.client";
import { CanActivateGuard } from "./helpers/canActivate.guard";
import { RegisterPosQrTerminalService } from './services/register-posqr-terminal.service';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    TopNavBarComponent,
    InfoBarComponent,
    WrapperComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    BrowserAnimationsModule,
    PermissionsModule,
    SnackBarModule,
    DateInputsModule,
    MatProgressBarModule,
    DialogsModule
  ],
  providers: [RegisterPosQrTerminalService, {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpConfigInterceptor,
    multi: true
  }, { provide: LOCALE_ID, useValue: 'ka-GE' }, IsLoadingService, PermissionsResolver, AccountClient, CanActivateGuard],
  exports: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
