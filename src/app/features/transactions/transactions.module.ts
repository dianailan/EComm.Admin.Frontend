import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionsComponent } from './transactions.component';
import { TransactionsRoutingModule } from './transactions-routing.module';
import {
  BodyModule, FilterService,
  GridModule,
  HeaderModule,
  PagerModule,
  RowFilterModule
} from "@progress/kendo-angular-grid";
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import { DialogModule } from "@progress/kendo-angular-dialog";
import { ButtonModule } from "@progress/kendo-angular-buttons";
import { PermissionsModule } from "../../shared/module/shared/permissions.module";
import { TransactionClient } from "../../services/admin.api.client";
import { TransactionDetailsComponent } from "./details/transaction-details.component";
import { SharedComponentsModule } from "../../shared/module/shared/shared.components.module";
import { DetailSearchComponent } from "./detail-search/detail-search.component";
import { MessageService } from "@progress/kendo-angular-l10n";
import { CustomMessagesService } from "../../services/custom-messages.service";
import '@progress/kendo-angular-intl/locales/es/all';
import { MatTooltipModule } from "@angular/material/tooltip";
import { TransactionLogs } from "./logs/logs.component";
import { PartialRefundDialogComponent } from "./partial-refund-dialog/partial-refund-dialog.component";

@NgModule({
  declarations: [
    DetailSearchComponent,
    TransactionsComponent,
    TransactionDetailsComponent,
    TransactionLogs,
    PartialRefundDialogComponent
  ],
  imports: [
    CommonModule,
    TransactionsRoutingModule,
    BodyModule,
    RowFilterModule,
    NgbDropdownModule,
    GridModule,
    HeaderModule,
    DialogModule,
    ButtonModule,
    PermissionsModule,
    PagerModule,
    SharedComponentsModule,
    MatTooltipModule,
  ],
  providers: [TransactionClient, FilterService, { provide: MessageService, useClass: CustomMessagesService }]
})
export class TransactionsModule {
}
