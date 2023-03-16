import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BodyModule, GridModule, HeaderModule, RowFilterModule, SharedModule } from "@progress/kendo-angular-grid";
import { SharedComponentsModule } from "../../shared/module/shared/shared.components.module";
import { RecurringCardClient } from "../../services/admin.api.client";
import { ButtonModule } from "@progress/kendo-angular-buttons";
import { DetailsComponent } from './details/details.component';
import { MessageService } from "@progress/kendo-angular-l10n";
import { CustomMessagesService } from "../../services/custom-messages.service";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ReccuringCardsComponent } from "./reccuring-cards.component";
import { ReccuringCardsRoutingModule } from "./reccuring-cards-routing.module";

@NgModule({
  declarations: [ReccuringCardsComponent, DetailsComponent],
  imports: [
    CommonModule, ReccuringCardsRoutingModule, BodyModule, SharedModule, RowFilterModule, SharedComponentsModule, GridModule, ButtonModule, HeaderModule, MatTooltipModule
  ],
  providers: [RecurringCardClient, { provide: MessageService, useClass: CustomMessagesService }]
})
export class ReccuringCardsModule {
}
