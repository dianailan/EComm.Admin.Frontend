import { Component, OnInit } from '@angular/core';
import { ActionLogListItem, PosQRTerminalClient } from "../../../services/admin.api.client";
import { ActivatedRoute } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { AppService } from "../../../services/app.service";

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})
export class LogsComponent implements OnInit {
  gridView: ActionLogListItem[];
  private posQrTerminalId;

  constructor(private posQrTerminalClient: PosQRTerminalClient, private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private appService: AppService
  ) {
    this.titleService.setTitle('POS QR Terminal | ლოგები');
    this.appService.setTitle('POS QR Terminal | ლოგები');
    this.activatedRoute.params.subscribe(p => {
      this.posQrTerminalId = p.id;
    });

    this.posQrTerminalClient.getPosQRTerminalLogs(this.posQrTerminalId)
      .subscribe((r: ActionLogListItem[]) => {
        this.gridView = r;
      });
  }

  ngOnInit(): void {
  }
}
