import { Component } from "@angular/core";
import { ActionLogListItem, FaceTerminalClient } from "../../../services/admin.api.client";
import { ActivatedRoute } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { AppService } from "../../../services/app.service";

@Component({
  selector: 'app-face-terminal-logs',
  templateUrl: './face-terminal-logs.component.html',
  styleUrls: ['./face-terminal-logs.component.scss']
})

export class FaceTerminalLogsComponent {
  gridView: ActionLogListItem[];
  private merchantId;

  constructor(private faceTerminalClient: FaceTerminalClient, private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private appService: AppService
  ) {
    this.titleService.setTitle('Face ტერმინალი | ლოგები');
    this.appService.setTitle('Face ტერმინალი | ლოგები');
    this.appService.setUrl('');
    this.activatedRoute.params.subscribe(p => {
      this.merchantId = p['id'];
    });

    this.faceTerminalClient.getFaceTerminalLogs(this.merchantId)
      .subscribe((r: ActionLogListItem[]) => {
        this.gridView = r;
      });
  }
}
