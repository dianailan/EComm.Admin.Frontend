import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QrMerchantComponent } from './qr-merchant.component';
import { RegisterQrMerchantComponent } from "./register-qr-merchant/register-qr-merchant.component";
import { QrMerchantDetailsComponent } from "./details/qr-merchant-details.component";
import { QrMerchantLogs } from "./logs/logs.component";

const routes: Routes = [
  { path: "", component: QrMerchantComponent },
  { path: "registerQrMerchant", pathMatch: 'full', component: RegisterQrMerchantComponent },
  { path: ":id", pathMatch: 'full', component: QrMerchantDetailsComponent },
  { path: ":id/logs", pathMatch: 'full', component: QrMerchantLogs },
];

@NgModule({
  exports: [RouterModule],
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class QrmerchantRoutingModule {
}
