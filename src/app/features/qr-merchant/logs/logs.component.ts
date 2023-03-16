import { Component } from "@angular/core";
import { ActionLogListItem, QRMerchantsClient } from "../../../services/admin.api.client";
import { ActivatedRoute } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { AppService } from "../../../services/app.service";

@Component({
  selector: 'app-qr-merchant-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})

export class QrMerchantLogs {
  gridView: ActionLogListItem[];
  private qrMerchantId;

  constructor(private qrMerchantClient: QRMerchantsClient, private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private appService: AppService
  ) {
    this.titleService.setTitle('QR სალარო | ლოგები');
    this.appService.setTitle('QR სალარო | ლოგები');
    this.activatedRoute.params.subscribe(p => {
      this.qrMerchantId = p['id'];
    });

    this.qrMerchantClient.getQRMerchantLogs(this.qrMerchantId)
      .subscribe((r: ActionLogListItem[]) => {
        this.gridView = r;
      });
  }
}
