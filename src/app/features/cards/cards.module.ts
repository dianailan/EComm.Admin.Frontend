import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardsRoutingModule } from './cards-routing.module';
import { CardsComponent } from './cards.component';
import { BodyModule, GridModule, HeaderModule, RowFilterModule, SharedModule } from "@progress/kendo-angular-grid";
import { SharedComponentsModule } from "../../shared/module/shared/shared.components.module";
import { CardClient } from "../../services/admin.api.client";
import { ButtonModule } from "@progress/kendo-angular-buttons";
import { DetailsComponent } from './details/details.component';
import { MessageService } from "@progress/kendo-angular-l10n";
import { CustomMessagesService } from "../../services/custom-messages.service";
import { MatTooltipModule } from "@angular/material/tooltip";

@NgModule({
  declarations: [CardsComponent, DetailsComponent],
  imports: [
    CommonModule, CardsRoutingModule, BodyModule, SharedModule, RowFilterModule, SharedComponentsModule, GridModule, ButtonModule, HeaderModule, MatTooltipModule
  ],
  providers: [CardClient, { provide: MessageService, useClass: CustomMessagesService }]
})
export class CardsModule {
}
