import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LogsComponent } from './logs.component';
import { DetailsComponent } from "./details/details.component";

const routes: Routes = [
  { path: "", component: LogsComponent },
  { path: ":id", component: DetailsComponent }
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)]
})
export class LogsRoutingModule {
}
