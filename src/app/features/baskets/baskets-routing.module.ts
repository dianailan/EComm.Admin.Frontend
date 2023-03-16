import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BasketsComponent } from "./baskets.component";
import { BasketDetailsComponent } from "./details/basket-details.component";
import { LogsComponent } from "./logs/logs.component";

const routes: Routes = [
  { path: "", component: BasketsComponent },
  { path: ":id", component: BasketDetailsComponent },
  { path: ":id/logs", component: LogsComponent },
]

@NgModule({
  exports: [RouterModule],
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class BasketsRoutingModule {
}
