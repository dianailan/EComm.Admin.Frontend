import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QrMerchantComponent } from './qr-merchant.component';
import { QrmerchantRoutingModule } from './qrmerchant-routing.module';
import { RegisterQrMerchantComponent } from "./register-qr-merchant/register-qr-merchant.component";
import { BodyModule, GridModule, HeaderModule, RowFilterModule, SharedModule } from "@progress/kendo-angular-grid";
import { PermissionsModule } from "../../shared/module/shared/permissions.module";
import { ButtonModule } from "@progress/kendo-angular-buttons";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedComponentsModule } from "../../shared/module/shared/shared.components.module";
import { CompanyClient, QRMerchantsClient } from "../../services/admin.api.client";
import { MessageService } from "@progress/kendo-angular-l10n";
import { CustomMessagesService } from "../../services/custom-messages.service";
import { MatTooltipModule } from "@angular/material/tooltip";
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import { DialogModule } from "@progress/kendo-angular-dialog";
import { QrMerchantDetailsComponent } from "./details/qr-merchant-details.component";
import { QrMerchantLogs } from "./logs/logs.component";
import { MerchantService } from "../../services/merchant.service";

@NgModule({
  declarations: [
    QrMerchantComponent,
    RegisterQrMerchantComponent,
    QrMerchantDetailsComponent,
    QrMerchantLogs
  ],
  imports: [
    CommonModule,
    QrmerchantRoutingModule,
    GridModule,
    PermissionsModule,
    ButtonModule,
    ReactiveFormsModule,
    SharedComponentsModule,
    SharedModule,
    RowFilterModule,
    BodyModule,
    HeaderModule,
    MatTooltipModule,
    NgbDropdownModule,
    DialogModule
  ],
  providers: [QRMerchantsClient, { provide: MessageService, useClass: CustomMessagesService }, CompanyClient, MerchantService],
  exports: [
  ]
})
export class QrmerchantModule {
}
