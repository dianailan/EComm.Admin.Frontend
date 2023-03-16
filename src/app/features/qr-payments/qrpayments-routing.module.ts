import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QrPaymentsComponent } from './qr-payments.component';
import { RegisterQrPaymentComponent } from "./register-qr-payment/register-qr-payment.component";
import { QrPaymentDetailsComponent } from "./details/qr-payment-details.component";
import { QrPaymentLogsComponent } from "./logs/qr-payment-logs.component";

const routes: Routes = [
  { path: "", component: QrPaymentsComponent },
  { path: "registerQrPayment", pathMatch: "full", component: RegisterQrPaymentComponent },
  { path: ":id", pathMatch: "full", component: QrPaymentDetailsComponent },
  { path: ":id/logs", pathMatch: 'full', component: QrPaymentLogsComponent }
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)]
})
export class QrpaymentsRoutingModule { }
