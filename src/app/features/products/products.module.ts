import { NgModule } from "@angular/core";
import { ProductsComponent } from "./products.component";
import { ProductsRoutingModule } from "./products-routing.module";
import { MessageService } from "@progress/kendo-angular-l10n";
import { CustomMessagesService } from "../../services/custom-messages.service";
import { PermissionsModule } from "../../shared/module/shared/permissions.module";
import { GridModule } from "@progress/kendo-angular-grid";
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import { DialogModule } from "@progress/kendo-angular-dialog";
import { SharedComponentsModule } from "../../shared/module/shared/shared.components.module";
import { ButtonModule } from "@progress/kendo-angular-buttons";
import { MatTooltipModule } from "@angular/material/tooltip";
import { CommonModule } from "@angular/common";
import { PayByLinkProductsClient } from "../../services/admin.api.client";
import { ProductDetailsComponent } from "./details/product-details.component";
import { LogsComponent } from "./logs/logs.component";

@NgModule({
  declarations: [
    ProductsComponent,
    ProductDetailsComponent,
    LogsComponent
  ],
  imports: [
    ProductsRoutingModule,
    PermissionsModule,
    GridModule,
    NgbDropdownModule,
    DialogModule,
    SharedComponentsModule,
    ButtonModule,
    MatTooltipModule,
    CommonModule
  ],
  providers: [PayByLinkProductsClient,
    { provide: MessageService, useClass: CustomMessagesService },
  ]
})

export class ProductsModule {
}
