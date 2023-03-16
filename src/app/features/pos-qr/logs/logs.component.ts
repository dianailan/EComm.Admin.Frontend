import { Component, OnInit } from '@angular/core';
import { ActionLogListItem, PosQRClient } from 'src/app/services/admin.api.client';
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
  private posQrId;

  constructor(private posQrClient: PosQRClient, private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private appService: AppService
  ) {
    this.titleService.setTitle('POS QR | ლოგები');
    this.appService.setTitle('POS QR | ლოგები');
    this.activatedRoute.params.subscribe(p => {
      this.posQrId = p.id;
    });

    this.posQrClient.getPosQrMerchantLogs(this.posQrId)
      .subscribe((r: ActionLogListItem[]) => {
        this.gridView = r;
      });
  }

  ngOnInit(): void {
  }
}
