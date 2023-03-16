import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaceMerchantComponent } from './face-merchant.component';
import { FacemerchantRoutingModule } from './Facemerchant-routing.module';
import { RegisterFaceMerchantComponent } from "./register-face-merchant/register-face-merchant.component";
import { BodyModule, GridModule, HeaderModule, RowFilterModule, SharedModule } from "@progress/kendo-angular-grid";
import { PermissionsModule } from "../../shared/module/shared/permissions.module";
import { ButtonModule } from "@progress/kendo-angular-buttons";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedComponentsModule } from "../../shared/module/shared/shared.components.module";
import { CompanyClient, FaceMerchantClient, FaceTerminalClient } from "../../services/admin.api.client";
import { MessageService } from "@progress/kendo-angular-l10n";
import { CustomMessagesService } from "../../services/custom-messages.service";
import { MatTooltipModule } from "@angular/material/tooltip";
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import { DialogModule } from "@progress/kendo-angular-dialog";
import { FaceMerchantDetailsComponent } from "./details/face-merchant-details.component";
import { FaceMerchantLogs } from "./logs/logs.component";
import { MerchantService } from "../../services/merchant.service";

@NgModule({
  declarations: [
    FaceMerchantComponent,
    RegisterFaceMerchantComponent,
    FaceMerchantDetailsComponent,
    FaceMerchantLogs
  ],
  imports: [
    CommonModule,
    FacemerchantRoutingModule,
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
  providers: [FaceMerchantClient, FaceTerminalClient, { provide: MessageService, useClass: CustomMessagesService }, CompanyClient, MerchantService],
  exports: [
  ]
})
export class FaceMerchantModule {
}
