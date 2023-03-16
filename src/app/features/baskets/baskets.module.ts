import { NgModule } from "@angular/core";
import { BasketsComponent } from "./baskets.component";
import { BasketsRoutingModule } from "./baskets-routing.module";
import { PermissionsModule } from "../../shared/module/shared/permissions.module";
import { GridModule } from "@progress/kendo-angular-grid";
import { ButtonModule } from "@progress/kendo-angular-buttons";
import { MatTooltipModule } from "@angular/material/tooltip";
import { SharedComponentsModule } from "../../shared/module/shared/shared.components.module";
import { CommonModule } from "@angular/common";
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import { DialogModule } from "@progress/kendo-angular-dialog";
import { MessageService } from "@progress/kendo-angular-l10n";
import { CustomMessagesService } from "../../services/custom-messages.service";
import { PayByLinkBasketsClient, PayByLinkProductsClient } from "../../services/admin.api.client";
import { BasketDetailsComponent } from "./details/basket-details.component";
import { LogsComponent } from "./logs/logs.component";

@NgModule({
  declarations: [
    BasketsComponent,
    BasketDetailsComponent,
    LogsComponent
  ],
  imports: [
    BasketsRoutingModule,
    PermissionsModule,
    GridModule,
    ButtonModule,
    MatTooltipModule,
    SharedComponentsModule,
    CommonModule,
    NgbDropdownModule,
    DialogModule
  ],
  providers: [PayByLinkBasketsClient, PayByLinkProductsClient,
    { provide: MessageService, useClass: CustomMessagesService },

  ]
})

export class BasketsModule {
}
