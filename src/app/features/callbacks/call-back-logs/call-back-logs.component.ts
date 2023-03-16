import { Component, OnInit } from '@angular/core';
import { ActionLogListItem, CallBackClient, WebPageClient } from "../../../services/admin.api.client";
import { ActivatedRoute } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { AppService } from "../../../services/app.service";

@Component({
  selector: 'app-call-back-logs',
  templateUrl: './call-back-logs.component.html',
  styleUrls: ['./call-back-logs.component.scss']
})
export class CallBackLogsComponent {
  gridView: ActionLogListItem[];
  private cbId;

  constructor(private callBackClient: CallBackClient, private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private appService: AppService
  ) {
    this.titleService.setTitle('ქოლბექი | ლოგები');
    this.appService.setTitle('ქოლბექი | ლოგები');

    this.activatedRoute.params.subscribe(p => {
      this.cbId = p['id'];
    });

    this.callBackClient.getCallBackLogs(this.cbId)
      .subscribe((r: ActionLogListItem[]) => {
        this.gridView = r;
      });
  }
}
