import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { UserClient } from '../../services/admin.api.client';
import {
  BodyModule, FilterService,
  GridModule,
  HeaderModule,
  PagerModule,
  RowFilterModule,
  SharedModule
} from '@progress/kendo-angular-grid';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { DetailsComponent } from './details/details.component';
import { LogsComponent } from './logs/logs.component';
import { RegisterUserComponent } from './register-user/register-user.component';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { PermissionsModule } from '../../shared/module/shared/permissions.module';
import { SharedComponentsModule } from "../../shared/module/shared/shared.components.module";
import { MessageService } from "@progress/kendo-angular-l10n";
import { CustomMessagesService } from "../../services/custom-messages.service";
import { MatTooltipModule } from "@angular/material/tooltip";
import { UserService } from "./user.service";
import { UserRegistrationPreviewComponent } from "./user-registration-preview/user-registration-preview.component";

@NgModule({
  imports: [
    CommonModule,
    UsersRoutingModule,
    BodyModule,
    RowFilterModule,
    NgbDropdownModule,
    GridModule,
    HeaderModule,
    DialogModule,
    ButtonModule,
    SharedModule,
    PermissionsModule,
    PagerModule,
    SharedComponentsModule,
    MatTooltipModule
  ],
  providers: [UserClient, FilterService, { provide: MessageService, useClass: CustomMessagesService }, UserService],
  declarations: [
    UsersComponent,
    DetailsComponent,
    LogsComponent,
    RegisterUserComponent,
    UserRegistrationPreviewComponent
  ]
})
export class UsersModule {
}
