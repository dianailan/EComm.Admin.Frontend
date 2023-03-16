import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyRoutingModule } from './company-routing.module';
import { CompanyComponent } from './company.component';
import { BodyModule, GridModule, HeaderModule, RowFilterModule, SharedModule } from "@progress/kendo-angular-grid";
import {
  CompanyClient, FaceMerchantClient, PosQRClient, PosQRTerminalClient,
  QRMerchantsClient,
  QRPaymentClient,
  UserClient,
  WebPageClient
} from "../../services/admin.api.client";
import { MessageService } from "@progress/kendo-angular-l10n";
import { CustomMessagesService } from "../../services/custom-messages.service";
import { MatTooltipModule } from "@angular/material/tooltip";
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import { SharedComponentsModule } from "../../shared/module/shared/shared.components.module";
import { ButtonModule } from "@progress/kendo-angular-buttons";
import { CompanyDetailsComponent } from "./details/company-details.component";
import { UsersGridDataComponent } from "./details/data-grid-components/users-data/users-grid-data.component";
import { WebpagesDataComponent } from "./details/data-grid-components/webpages-data/webpages-data.component";
import { QrpaymentsDataComponent } from "./details/data-grid-components/qrpayments-data/qrpayments-data.component";
import { QrmerchantsDataComponent } from "./details/data-grid-components/qrmerchants-data/qrmerchants-data.component";
// import {AddUserToCompanyComponent} from "./details/popup-components/add-user-to-company/add-user-to-company.component";
import { AddUserToCompanyComponent } from "./components/add-user-to-company/add-user-to-company.component";
import { DialogModule, WindowModule } from "@progress/kendo-angular-dialog";
import { CompanyLogsComponent } from "./logs/company-logs.component";
import { PermissionsModule } from "../../shared/module/shared/permissions.module";
import { ChangeUserRoleComponent } from "./details/popup-components/change-user-role/change-user-role.component";
import { RegisterCompanyComponent } from "./register-company/register-company.component";
import { CheckUserComponent } from "./check-user/check-user.component";
import { MerchantService } from "../../services/merchant.service";
import { FaceMerchantsDataComponent } from "./details/data-grid-components/facemerchants-data/face-merchants-data.component";
import { AddUserService } from "./services/add-user.service";
import { ConfirmUserRoleComponent } from "./details/popup-components/confirm-user-role/confirm-user-role.component";
import { PosqrDataComponent } from './details/data-grid-components/posqr-data/posqr-data.component';
import { PosqrterminalDataComponent } from './details/data-grid-components/posqrterminal-data/posqrterminal-data.component';

@NgModule({
  imports: [
    CommonModule,
    CompanyRoutingModule,
    GridModule,
    SharedModule,
    MatTooltipModule,
    HeaderModule,
    RowFilterModule,
    BodyModule,
    NgbDropdownModule,
    SharedComponentsModule,
    ButtonModule,
    WindowModule,
    DialogModule,
    PermissionsModule
  ],
  declarations: [
    CompanyComponent,
    CompanyDetailsComponent,
    UsersGridDataComponent,
    WebpagesDataComponent,
    QrpaymentsDataComponent,
    QrmerchantsDataComponent,
    AddUserToCompanyComponent,
    CompanyLogsComponent,
    ChangeUserRoleComponent,
    RegisterCompanyComponent,
    CheckUserComponent,
    FaceMerchantsDataComponent,
    ConfirmUserRoleComponent,
    PosqrDataComponent,
    PosqrterminalDataComponent
  ],
  providers: [CompanyClient, {
    provide: MessageService,
    useClass: CustomMessagesService
  }, WebPageClient, QRPaymentClient, QRMerchantsClient, FaceMerchantClient, PosQRClient, PosQRTerminalClient, UserClient, MerchantService, AddUserService]
})
export class CompanyModule {
}
