import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FaceMerchantComponent } from './face-merchant.component';
import { RegisterFaceMerchantComponent } from "./register-face-merchant/register-face-merchant.component";
import { FaceMerchantDetailsComponent } from "./details/face-merchant-details.component";
import { FaceMerchantLogs } from "./logs/logs.component";

const routes: Routes = [
  { path: "", component: FaceMerchantComponent },
  { path: "registerFaceMerchant", pathMatch: 'full', component: RegisterFaceMerchantComponent },
  { path: ":id", pathMatch: 'full', component: FaceMerchantDetailsComponent },
  { path: ":id/logs", pathMatch: 'full', component: FaceMerchantLogs },
];

@NgModule({
  exports: [RouterModule],
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class FacemerchantRoutingModule {
}
