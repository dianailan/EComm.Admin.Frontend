import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebPagesComponent } from './web-pages.component';
import { WebpagesRoutingModule } from './webpages-routing.module';
import { BodyModule, FilterService, GridModule, HeaderModule, RowFilterModule, SharedModule } from "@progress/kendo-angular-grid";
import { CompanyClient, WebPageClient } from "../../services/admin.api.client";
import { MessageService } from "@progress/kendo-angular-l10n";
import { CustomMessagesService } from "../../services/custom-messages.service";
import { MatTooltipModule } from "@angular/material/tooltip";
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import { ButtonModule } from "@progress/kendo-angular-buttons";
import { PermissionsModule } from "../../shared/module/shared/permissions.module";
import { SharedComponentsModule } from "../../shared/module/shared/shared.components.module";
import { DetailSearchComponent } from "./detail-search/detail-search.component";
import { DialogModule } from "@progress/kendo-angular-dialog";
import { RegisterWebPage } from "./register-web-page/register-web-page.component";
import { PageDetails } from "./details/web-page-details.component";
import { WebPageLogs } from "./logs/logs.component";
import { MerchantService } from "../../services/merchant.service";

@NgModule({
  declarations: [
    DetailSearchComponent,
    WebPagesComponent,
    RegisterWebPage,
    PageDetails,
    WebPageLogs
  ],
  imports: [
    CommonModule,
    WebpagesRoutingModule,
    GridModule,
    SharedModule,
    HeaderModule,
    MatTooltipModule,
    RowFilterModule,
    BodyModule,
    NgbDropdownModule,
    ButtonModule,
    PermissionsModule,
    SharedComponentsModule,
    DialogModule
  ],
  providers: [WebPageClient, FilterService, { provide: MessageService, useClass: CustomMessagesService }, CompanyClient, MerchantService]
})
export class WebpagesModule {
}
