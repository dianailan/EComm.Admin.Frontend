import { RouterModule, Routes } from "@angular/router";
import { CallbacksComponent } from "./callbacks.component";
import { NgModule } from "@angular/core";
import { CallBackLogsComponent } from "./call-back-logs/call-back-logs.component";

const routes: Routes = [
  { path: '', component: CallbacksComponent },
  { path: ":id/logs", component: CallBackLogsComponent }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class CallbacksRoutingModule {
}
