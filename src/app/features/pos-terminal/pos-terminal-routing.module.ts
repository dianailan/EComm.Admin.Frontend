import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PosTerminalDetailsComponent } from './details/pos-terminal-details.component';
import { PosTerminalComponent } from './pos-terminal.component';
import { RegisterPosTerminalComponent } from './register-pos-terminal/register-pos-terminal.component';
import { LogsComponent } from './logs/logs.component';

const routes: Routes = [
  { path: "", component: PosTerminalComponent },
  { path: "registerPosTerminal", pathMatch: 'full', component: RegisterPosTerminalComponent },
  { path: ":id", pathMatch: 'full', component: PosTerminalDetailsComponent },
  { path: ":id/logs", pathMatch: 'full', component: LogsComponent },
];

@NgModule({
  exports: [RouterModule],
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class PosTerminalRoutingModule {
}
