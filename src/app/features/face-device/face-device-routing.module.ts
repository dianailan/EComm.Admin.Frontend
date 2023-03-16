import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FaceDeviceComponent } from "./face-device.component";
import { FaceDeviceDetailsComponent } from "./details/face-device-details.component";
import { FaceDeviceLogsComponent } from "./logs/face-device-logs.component";

const routes: Routes = [
  { path: "", component: FaceDeviceComponent },
  { path: ":id", component: FaceDeviceDetailsComponent },
  { path: ":id/logs", component: FaceDeviceLogsComponent },
];

@NgModule({
  exports: [RouterModule],
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class FaceDeviceRoutingModule {
}
