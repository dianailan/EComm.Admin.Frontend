import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogsComponent } from './logs.component';
import { LogsRoutingModule } from './logs-routing.module';
import { ActionLogsClient } from "../../services/admin.api.client";
import { BodyModule, GridModule, HeaderModule, RowFilterModule, SharedModule } from "@progress/kendo-angular-grid";
import { SharedComponentsModule } from "../../shared/module/shared/shared.components.module";
import { ButtonModule } from "@progress/kendo-angular-buttons";
import { MessageService } from "@progress/kendo-angular-l10n";
import { CustomMessagesService } from "../../services/custom-messages.service";
import { DetailsComponent } from "./details/details.component";
import { MatTooltipModule } from "@angular/material/tooltip";

@NgModule({
  declarations: [LogsComponent, DetailsComponent],
  imports: [
    CommonModule, LogsRoutingModule, GridModule, SharedModule, SharedComponentsModule, BodyModule, RowFilterModule, ButtonModule, HeaderModule, MatTooltipModule
  ],
  providers: [ActionLogsClient, { provide: MessageService, useClass: CustomMessagesService }]
})
export class LogsModule {
}
