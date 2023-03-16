import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BodyModule, GridModule, HeaderModule, RowFilterModule, SharedModule } from "@progress/kendo-angular-grid";
import { SharedComponentsModule } from "../../shared/module/shared/shared.components.module";
import { CertificateClient } from "../../services/admin.api.client";
import { ButtonModule } from "@progress/kendo-angular-buttons";
import { MessageService } from "@progress/kendo-angular-l10n";
import { CustomMessagesService } from "../../services/custom-messages.service";
import { MatTooltipModule } from "@angular/material/tooltip";
import { CertificatesComponent } from "./certificates.component";
import { CertificatesRoutingModule } from "./certificates-routing.module";
import { PermissionsModule } from "../../shared/module/shared/permissions.module";

@NgModule({
  declarations: [CertificatesComponent],
  imports: [
    CommonModule, CertificatesRoutingModule, BodyModule, SharedModule, RowFilterModule, SharedComponentsModule, GridModule, HeaderModule, MatTooltipModule, ButtonModule, PermissionsModule
  ],
  providers: [CertificateClient, { provide: MessageService, useClass: CustomMessagesService }]
})
export class CertificatesModule {
}
