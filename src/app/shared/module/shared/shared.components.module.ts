import { LOCALE_ID, ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateRangePickerComponent } from "../../components/date-range-picker/date-range-picker.component";
import { DateInputModule, DateRangeModule, MultiViewCalendarModule } from "@progress/kendo-angular-dateinputs";
import { DropdownFilterComponent } from "../../components/dropdown-filter/dropdown-filter.component";
import { DropDownListModule } from "@progress/kendo-angular-dropdowns";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ValidationMessagesComponent } from "../../components/validation-messages/validation-messages.component";
import { RegisterQrMerchantRegistrationForm } from "../../components/register-qr-merchant-registration-form/register-qr-merchant-registration-form";
import { RegisterFaceMerchantRegistrationForm } from "../../components/register-face-merchant-registration-form/register-face-merchant-registration-form";
import { RegisterPosqrTerminalRegistrationFormComponent } from '../../components/register-posqr-terminal-registration-form/register-posqr-terminal-registration-form.component';
import { DialogModule } from "@progress/kendo-angular-dialog";
import { LogsComponent } from "../../components/logs/logs.component";
import { ActionsComponent } from "../../components/logs/actions/actions.component";
import { BodyModule, GridModule, SharedModule } from "@progress/kendo-angular-grid";
import { PermissionsModule } from "./permissions.module";
import { CheckCompanyNumberComponent } from "../../components/check-company-number/check-company-number.component";
import { IsPosqrAcceptedComponent } from '../../components/is-posqr-accepted/is-posqr-accepted.component';
import { ButtonModule } from "@progress/kendo-angular-buttons";
import { RegisterWebPageRegistrationForm } from "../../components/register-web-page-registration-form/register-web-page-registration-form";
import { RegisterQrPaymentRegistrationForm } from "../../components/register-qr-payment-registration-form/register-qr-payment-registration-form";
import { UserDeleteConfirmComponent } from "../../components/user-delete-confirm/user-delete-confirm.component";
import { ConfirmActionComponent } from "../../components/confirm-action/confirm-action.component";
import { AddCommentComponent } from "../../components/add-comment/add-comment.component";
import { RegisterPosQrRegistrationFormComponent } from '../../components/register-pos-qr-merchant-registration-form/register-pos-qr-registration-form/register-pos-qr-registration-form.component';

@NgModule({
  declarations: [
    DateRangePickerComponent,
    DropdownFilterComponent,
    ValidationMessagesComponent,
    RegisterQrMerchantRegistrationForm,
    RegisterPosqrTerminalRegistrationFormComponent,
    RegisterFaceMerchantRegistrationForm,
    RegisterWebPageRegistrationForm,
    RegisterPosQrRegistrationFormComponent,
    LogsComponent,
    ActionsComponent,
    CheckCompanyNumberComponent,
    IsPosqrAcceptedComponent,
    RegisterQrPaymentRegistrationForm,
    UserDeleteConfirmComponent,
    ConfirmActionComponent,
    AddCommentComponent
  ],
  imports: [
    CommonModule,
    DateRangeModule,
    DateInputModule,
    MultiViewCalendarModule,
    DropDownListModule,
    FormsModule,
    DialogModule,
    ReactiveFormsModule,
    GridModule,
    SharedModule,
    BodyModule,
    PermissionsModule,
    ButtonModule
  ],
  exports: [
    DateRangePickerComponent,
    DropdownFilterComponent,
    DateRangeModule,
    DateInputModule,
    MultiViewCalendarModule,
    DropDownListModule,
    ValidationMessagesComponent,
    RegisterQrMerchantRegistrationForm,
    RegisterPosqrTerminalRegistrationFormComponent,
    RegisterFaceMerchantRegistrationForm,
    RegisterWebPageRegistrationForm,
    RegisterPosQrRegistrationFormComponent,
    LogsComponent,
    ActionsComponent,
    RegisterQrPaymentRegistrationForm,
    UserDeleteConfirmComponent,
    ConfirmActionComponent,
    AddCommentComponent
  ]
})
export class SharedComponentsModule {
  static forChild(): ModuleWithProviders<SharedComponentsModule> {
    return {
      ngModule: SharedComponentsModule,
      providers: []
    };
  }
}
