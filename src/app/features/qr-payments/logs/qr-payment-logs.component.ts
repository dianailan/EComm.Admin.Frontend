import { Component } from "@angular/core";
import { ActionLogListItem, QRPaymentClient } from "../../../services/admin.api.client";
import { ActivatedRoute } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { AppService } from "../../../services/app.service";

@Component({
  selector: 'app-qr-payment-logs',
  templateUrl: './qr-payment-logs.component.html',
  styleUrls: ['./qr-payment-logs.component.scss']
})

export class QrPaymentLogsComponent {
  gridView: ActionLogListItem[];
  private qrPaymentId: number;
  constructor(private activatedRoute: ActivatedRoute, private qrPaymentClient: QRPaymentClient, private titleService: Title, private appService: AppService) {
    this.titleService.setTitle('QR ობიექტები | ლოგები');
    this.appService.setTitle('QR ობიექტები | ლოგები');

    this.activatedRoute.params.subscribe(p => {
      this.qrPaymentId = p['id'];
    });

    this.qrPaymentClient.getQRPaymentLogs(this.qrPaymentId)
      .subscribe((r: ActionLogListItem[]) => {
        this.gridView = r;
      });
  }
}
