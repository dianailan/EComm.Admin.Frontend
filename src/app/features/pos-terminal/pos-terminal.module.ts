import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PosTerminalComponent } from './pos-terminal.component';
import { PosTerminalRoutingModule } from './pos-terminal-routing.module';
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
import { RegisterPosTerminalComponent } from './register-pos-terminal/register-pos-terminal.component';
import { PosTerminalDetailsComponent } from './details/pos-terminal-details.component';
import { LogsComponent } from './logs/logs.component';

@NgModule({
  declarations: [
    PosTerminalComponent,
    RegisterPosTerminalComponent,
    PosTerminalDetailsComponent,
    LogsComponent,
  ],
  imports: [
    CommonModule,
    PosTerminalRoutingModule,
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
  providers: [PosQRTerminalClient, PosQRClient, { provide: MessageService, useClass: CustomMessagesService }, CompanyClient, MerchantService],
  exports: [
  ]
})
export class PosTerminalMoudle {
}
