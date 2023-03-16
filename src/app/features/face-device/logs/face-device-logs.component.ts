import { Component } from "@angular/core";
import { ActionLogListItem, FaceDeviceClient } from "../../../services/admin.api.client";
import { ActivatedRoute } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { AppService } from "../../../services/app.service";

@Component({
  selector: 'app-face-device-logs',
  templateUrl: './face-device-logs.component.html',
  styleUrls: ['./face-device-logs.component.scss']
})

export class FaceDeviceLogsComponent {
  gridView: ActionLogListItem[];
  private deviceId;

  constructor(private faceDeviceClient: FaceDeviceClient, private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private appService: AppService
  ) {
    this.titleService.setTitle('Face დივაისი | ლოგები');
    this.appService.setTitle('Face დივაისი | ლოგები');
    this.appService.setUrl('');
    this.activatedRoute.params.subscribe(p => {
      this.deviceId = p['id'];
    });

    this.faceDeviceClient.getFaceDeviceLogs(this.deviceId)
      .subscribe((r: ActionLogListItem[]) => {
        this.gridView = r;
      });
  }
}
