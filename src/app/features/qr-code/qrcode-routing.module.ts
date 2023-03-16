import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QrCodeComponent } from './qr-code.component';

const routes: Routes = [
  { path: "", component: QrCodeComponent }
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)]
})
export class QrcodeRoutingModule {
}
