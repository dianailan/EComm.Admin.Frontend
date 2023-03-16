import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductsComponent } from "./products.component";
import { ProductDetailsComponent } from "./details/product-details.component";
import { LogsComponent } from "./logs/logs.component";

const routes: Routes = [
  { path: "", component: ProductsComponent },
  { path: ":id", component: ProductDetailsComponent },
  { path: ":id/logs", component: LogsComponent },
];

@NgModule({
  exports: [RouterModule],
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class ProductsRoutingModule {
}
