import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QrPaymentsComponent } from './qr-payments.component';
import { QrpaymentsRoutingModule } from './qrpayments-routing.module';
import { BodyModule, GridModule, HeaderModule, RowFilterModule, SharedModule } from "@progress/kendo-angular-grid";
import { MatTooltipModule } from "@angular/material/tooltip";
import { CompanyClient, QRCodeClient, QRPaymentClient } from "../../services/admin.api.client";
import { SharedComponentsModule } from "../../shared/module/shared/shared.components.module";
import { ButtonModule } from "@progress/kendo-angular-buttons";
import { PermissionsModule } from "../../shared/module/shared/permissions.module";
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import { DialogModule } from "@progress/kendo-angular-dialog";
import { MessageService } from "@progress/kendo-angular-l10n";
import { CustomMessagesService } from "../../services/custom-messages.service";
import { RegisterQrPaymentComponent } from "./register-qr-payment/register-qr-payment.component";
import { QrPaymentDetailsComponent } from "./details/qr-payment-details.component";
import { QrPaymentLogsComponent } from "./logs/qr-payment-logs.component";
import { CashdeskComponent } from "./details/cashdesk/cashdesk.component";
import { QRCodeModule } from "angularx-qrcode";
import { addCashierToCashdeskComponent } from "./details/popup-components/add-cashier-to-cashdesk/add-cashier-to-cashdesk.component";
import { AddDeviceComponent } from "./details/popup-components/add-device/add-device.component";
import { AddCashdeskComponent } from "./details/popup-components/add-cashdesk/add-cashdesk.component";
import { AddCashdeskWithDeviceComponent } from "./details/popup-components/add-cashdesk-with-device/add-cashdesk-with-device.component";
import { AddCashdeskWithExistingQrComponent } from "./details/popup-components/add-cashdesk-with-existing-qr/add-cashdesk-with-existing-qr.component";
import { PrintQrComponent } from "./details/popup-components/print-qr/print-qr.component";
import { DownloadService } from "../../services/download.service";
import { MerchantService } from "../../services/merchant.service";

@NgModule({
    declarations: [
        QrPaymentsComponent,
        RegisterQrPaymentComponent,
        QrPaymentDetailsComponent,
        QrPaymentLogsComponent,
        CashdeskComponent,
        addCashierToCashdeskComponent,
        AddDeviceComponent,
        AddCashdeskComponent,
        AddCashdeskWithDeviceComponent,
        AddCashdeskWithExistingQrComponent,
        PrintQrComponent
    ],
    imports: [
        CommonModule,
        QrpaymentsRoutingModule,
        GridModule,
        SharedModule,
        HeaderModule,
        MatTooltipModule,
        RowFilterModule,
        SharedComponentsModule,
        BodyModule,
        ButtonModule,
        PermissionsModule,
        NgbDropdownModule,
        DialogModule,
        QRCodeModule
    ],
    providers: [QRPaymentClient, { provide: MessageService, useClass: CustomMessagesService }, CompanyClient, DownloadService, QRCodeClient, MerchantService]
})
export class QrpaymentsModule {
}
