import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PosQrComponent } from './pos-qr.component';
import { PosQrRoutingModule } from './posqr-routing.module';
import { BodyModule, GridModule, HeaderModule, RowFilterModule, SharedModule } from "@progress/kendo-angular-grid";
import { PermissionsModule } from "../../shared/module/shared/permissions.module";
import { ButtonModule } from "@progress/kendo-angular-buttons";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedComponentsModule } from "../../shared/module/shared/shared.components.module";
import { CompanyClient, PosQRClient, PosQRTerminalClient } from "../../services/admin.api.client";
import { MessageService } from "@progress/kendo-angular-l10n";
import { CustomMessagesService } from "../../services/custom-messages.service";
import { MatTooltipModule } from "@angular/material/tooltip";
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import { DialogModule } from "@progress/kendo-angular-dialog";
import { MerchantService } from "../../services/merchant.service";
import { RegisterPosQrMerchantComponent } from './register-pos-qr-merchant/register-pos-qr-merchant/register-pos-qr-merchant.component';
import { PosQrMerchantDetailsComponent } from './details/pos-qr-merchant-details.component';
import { LogsComponent } from './logs/logs.component';

@NgModule({
  declarations: [
    PosQrComponent,
    RegisterPosQrMerchantComponent,
    PosQrMerchantDetailsComponent,
    LogsComponent
  ],
  imports: [
    CommonModule,
    PosQrRoutingModule,
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
  providers: [PosQRClient, { provide: MessageService, useClass: CustomMessagesService }, CompanyClient, MerchantService, PosQRTerminalClient],
  exports: [
  ]
})
export class PosqrMoudle {
}
