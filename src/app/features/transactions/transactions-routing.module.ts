import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransactionsComponent } from './transactions.component';
import { TransactionDetailsComponent } from "./details/transaction-details.component";
import { TransactionLogs } from "./logs/logs.component";

const routes: Routes = [
  { path: "", component: TransactionsComponent },
  { path: ':id', component: TransactionDetailsComponent },
  { path: ':id/logs', component: TransactionLogs },
];

@NgModule({
  exports: [RouterModule],
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class TransactionsRoutingModule {
}
