import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QrCodeComponent } from './qr-code.component';
import { QrcodeRoutingModule } from './qrcode-routing.module';
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import { QRCodeClient } from "../../services/admin.api.client";
import { TextBoxModule } from "@progress/kendo-angular-inputs";
import { BodyModule, FilterService, GridModule, HeaderModule, RowFilterModule } from "@progress/kendo-angular-grid";
import { DropDownsModule } from "@progress/kendo-angular-dropdowns";
import { DialogModule } from '@progress/kendo-angular-dialog';
import { ButtonModule } from "@progress/kendo-angular-buttons";
import { DownloadGroupComponent } from './download-group/download-group.component';
import { GenerateGroupComponent } from './generate-group/generate-group.component';
import { PermissionsModule } from '../../shared/module/shared/permissions.module';
import { UsersModule } from "../users/users.module";
import { SharedComponentsModule } from "../../shared/module/shared/shared.components.module";
import { MessageService } from "@progress/kendo-angular-l10n";
import { CustomMessagesService } from "../../services/custom-messages.service";
import { MatTooltipModule } from "@angular/material/tooltip";

@NgModule({
  declarations: [QrCodeComponent, DownloadGroupComponent, GenerateGroupComponent],
  imports: [
    CommonModule,
    QrcodeRoutingModule,
    TextBoxModule,
    GridModule,
    BodyModule,
    DropDownsModule,
    NgbDropdownModule,
    DialogModule,
    ButtonModule,
    RowFilterModule,
    PermissionsModule,
    UsersModule,
    SharedComponentsModule,
    HeaderModule,
    MatTooltipModule
  ],
  providers: [QRCodeClient, FilterService, { provide: MessageService, useClass: CustomMessagesService }],
  exports: [
    QrCodeComponent
  ]
})
export class QrCodeModule {
}
