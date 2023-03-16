import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BodyModule, GridModule, HeaderModule, RowFilterModule, SharedModule } from "@progress/kendo-angular-grid";
import { PermissionsModule } from "../../shared/module/shared/permissions.module";
import { ButtonModule } from "@progress/kendo-angular-buttons";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedComponentsModule } from "../../shared/module/shared/shared.components.module";
import { CompanyClient, FaceDeviceClient } from "../../services/admin.api.client";
import { MessageService } from "@progress/kendo-angular-l10n";
import { CustomMessagesService } from "../../services/custom-messages.service";
import { MatTooltipModule } from "@angular/material/tooltip";
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import { DialogModule } from "@progress/kendo-angular-dialog";
import { MerchantService } from "../../services/merchant.service";
import { FaceDeviceRoutingModule } from "./face-device-routing.module";
import { FaceDeviceComponent } from "./face-device.component";
import { FaceDeviceDetailsComponent } from "./details/face-device-details.component";
import { FaceDeviceLogsComponent } from "./logs/face-device-logs.component";
import { AddFaceDeviceComponent } from "./add-face-device/add-face-device.component";

@NgModule({
  declarations: [
    FaceDeviceComponent,
    FaceDeviceDetailsComponent,
    FaceDeviceLogsComponent,
    AddFaceDeviceComponent
  ],
  imports: [
    CommonModule,
    FaceDeviceRoutingModule,
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
  providers: [FaceDeviceClient, { provide: MessageService, useClass: CustomMessagesService }, CompanyClient, MerchantService],
  exports: [
  ]
})
export class FaceDeviceModule {
}
