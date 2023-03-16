import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailsComponent } from "./details/details.component";
import { ReccuringCardsComponent } from "./reccuring-cards.component";

const routes: Routes = [
    { path: "", component: ReccuringCardsComponent },
    { path: ":id", component: DetailsComponent }
];

@NgModule({
    exports: [RouterModule],
    imports: [
        RouterModule.forChild(routes)
    ]
})
export class ReccuringCardsRoutingModule {
}
