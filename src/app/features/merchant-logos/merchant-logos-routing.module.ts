import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MerchantLogosComponent } from "./merchant-logos.component";
import { MerchantLogoLogs } from "./logs/logs.component";

const routes: Routes = [
  { path: "", component: MerchantLogosComponent },
  { path: ":id/logs", component: MerchantLogoLogs }
];

@NgModule({
  exports: [RouterModule],
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class MerchantLogosRoutingModule {
}
