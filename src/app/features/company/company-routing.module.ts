import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanyComponent } from './company.component';
import { CompanyDetailsComponent } from "./details/company-details.component";
import { CompanyLogsComponent } from "./logs/company-logs.component";
import { RegisterCompanyComponent } from "./register-company/register-company.component";
import { AddUserToCompanyComponent } from "./components/add-user-to-company/add-user-to-company.component";

const routes: Routes = [
  { path: "", component: CompanyComponent },
  { path: "registerCompany", component: RegisterCompanyComponent },
  { path: ":id", component: CompanyDetailsComponent },
  { path: ":id/logs", component: CompanyLogsComponent },
  { path: ":id/add-user", component: AddUserToCompanyComponent },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)]
})
export class CompanyRoutingModule {
}
