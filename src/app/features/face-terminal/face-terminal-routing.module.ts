import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FaceTerminalComponent } from "./face-terminal.component";
import { FaceTerminalDetailsComponent } from "./details/face-terminal-details.component";
import { FaceTerminalLogsComponent } from "./logs/face-terminal-logs.component";

const routes: Routes = [
  { path: "", component: FaceTerminalComponent },
  // {path: "registerFaceMerchant", pathMatch: 'full', component: RegisterFaceMerchantComponent},
  { path: ":id", component: FaceTerminalDetailsComponent },
  { path: ":id/logs", component: FaceTerminalLogsComponent },
];

@NgModule({
  exports: [RouterModule],
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class FaceTerminalRoutingModule {
}
