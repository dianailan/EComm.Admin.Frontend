import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CertificatesComponent } from "./certificates.component";

const routes: Routes = [
  { path: "", component: CertificatesComponent },
];

@NgModule({
  exports: [RouterModule],
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class CertificatesRoutingModule {
}
