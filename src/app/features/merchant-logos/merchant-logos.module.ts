import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BodyModule, GridModule, HeaderModule, RowFilterModule, SharedModule } from "@progress/kendo-angular-grid";
import { PermissionsModule } from "../../shared/module/shared/permissions.module";
import { ButtonModule } from "@progress/kendo-angular-buttons";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedComponentsModule } from "../../shared/module/shared/shared.components.module";
import { CompanyClient, MerchantLogosClient } from "../../services/admin.api.client";
import { MessageService } from "@progress/kendo-angular-l10n";
import { CustomMessagesService } from "../../services/custom-messages.service";
import { MatTooltipModule } from "@angular/material/tooltip";
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import { DialogModule } from "@progress/kendo-angular-dialog";
import { MerchantService } from "../../services/merchant.service";
import { MerchantLogosComponent } from "./merchant-logos.component";
import { MerchantLogosRoutingModule } from "./merchant-logos-routing.module";
import { MerchantLogoLogs } from "./logs/logs.component";
import { ShowCommentComponent } from "./show-comment/show-comment.component";

@NgModule({
  declarations: [
    MerchantLogosComponent,
    MerchantLogoLogs,
    ShowCommentComponent
  ],
  imports: [
    CommonModule,
    MerchantLogosRoutingModule,
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
  providers: [MerchantLogosClient, { provide: MessageService, useClass: CustomMessagesService }, CompanyClient, MerchantService],
  exports: [
  ]
})
export class MerchantLogosModule {
}
