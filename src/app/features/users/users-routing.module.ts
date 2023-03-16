import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './users.component';
import { DetailsComponent } from './details/details.component';
import { LogsComponent } from './logs/logs.component';

const routes: Routes = [
  { path: '', component: UsersComponent },
  { path: ':id', component: DetailsComponent },
  { path: ':id/logs', component: LogsComponent }
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)]
})
export class UsersRoutingModule {
}
