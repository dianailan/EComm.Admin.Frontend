import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CardsComponent } from './cards.component';
import { DetailsComponent } from "./details/details.component";

const routes: Routes = [
  { path: "", component: CardsComponent },
  { path: ":id", component: DetailsComponent }
];

@NgModule({
  exports: [RouterModule],
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class CardsRoutingModule {
}
