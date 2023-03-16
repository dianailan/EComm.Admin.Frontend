import { NgModule } from "@angular/core";
import { CallbacksComponent } from "./callbacks.component";
import { CommonModule } from "@angular/common";
import { FilterService, GridModule } from "@progress/kendo-angular-grid";
import { CallBackClient, WebPageClient } from "../../services/admin.api.client";
import { MessageService } from "@progress/kendo-angular-l10n";
import { CustomMessagesService } from "../../services/custom-messages.service";
import { CallbacksRoutingModule } from "./callbacks-routing.module";
import { SharedComponentsModule } from "../../shared/module/shared/shared.components.module";
import { MatTooltipModule } from "@angular/material/tooltip";
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import { DialogModule } from "@progress/kendo-angular-dialog";
import { PermissionsModule } from "../../shared/module/shared/permissions.module";;
import { CallBackLogsComponent } from './call-back-logs/call-back-logs.component'
import { ShowCbCommentComponent } from './show-cb-comment/show-cb-comment.component'

@NgModule({
    declarations: [
        CallbacksComponent,
        CallBackLogsComponent,
        ShowCbCommentComponent
    ],
    imports: [
        CommonModule,
        GridModule,
        CallbacksRoutingModule,
        SharedComponentsModule,
        MatTooltipModule,
        NgbDropdownModule,
        DialogModule,
        PermissionsModule
    ],
    providers: [CallBackClient, FilterService, { provide: MessageService, useClass: CustomMessagesService }]
})

export class CallbacksModule {
}
