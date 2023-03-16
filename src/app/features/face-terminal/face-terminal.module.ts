import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BodyModule, GridModule, HeaderModule, RowFilterModule, SharedModule } from "@progress/kendo-angular-grid";
import { PermissionsModule } from "../../shared/module/shared/permissions.module";
import { ButtonModule } from "@progress/kendo-angular-buttons";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedComponentsModule } from "../../shared/module/shared/shared.components.module";
import { CompanyClient, FaceTerminalClient } from "../../services/admin.api.client";
import { MessageService } from "@progress/kendo-angular-l10n";
import { CustomMessagesService } from "../../services/custom-messages.service";
import { MatTooltipModule } from "@angular/material/tooltip";
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import { DialogModule } from "@progress/kendo-angular-dialog";
import { MerchantService } from "../../services/merchant.service";
import { FaceTerminalRoutingModule } from "./face-terminal-routing.module";
import { FaceTerminalComponent } from "./face-terminal.component";
import { FaceTerminalDetailsComponent } from "./details/face-terminal-details.component";
import { FaceTerminalLogsComponent } from "./logs/face-terminal-logs.component";
import { AddFaceTerminalComponent } from "./add-face-terminal/add-face-terminal.component";

@NgModule({
    declarations: [
        FaceTerminalComponent,
        FaceTerminalDetailsComponent,
        FaceTerminalLogsComponent,
        AddFaceTerminalComponent
    ],
    imports: [
        CommonModule,
        FaceTerminalRoutingModule,
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
    providers: [FaceTerminalClient, { provide: MessageService, useClass: CustomMessagesService }, CompanyClient, MerchantService],
    exports: [
    ]
})
export class FaceTerminalModule {
}
