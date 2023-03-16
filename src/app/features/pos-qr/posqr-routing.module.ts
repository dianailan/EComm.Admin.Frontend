import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PosQrMerchantDetailsComponent } from './details/pos-qr-merchant-details.component';
import { LogsComponent } from './logs/logs.component';
import { PosQrComponent } from './pos-qr.component';
import { RegisterPosQrMerchantComponent } from './register-pos-qr-merchant/register-pos-qr-merchant/register-pos-qr-merchant.component';

const routes: Routes = [
  { path: "", component: PosQrComponent },
  { path: "registerPosQr", pathMatch: 'full', component: RegisterPosQrMerchantComponent },
  { path: ":id", pathMatch: 'full', component: PosQrMerchantDetailsComponent },
  { path: ":id/logs", pathMatch: 'full', component: LogsComponent },
];

@NgModule({
  exports: [RouterModule],
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class PosQrRoutingModule {
}
