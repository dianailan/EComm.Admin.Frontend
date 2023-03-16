import { Component } from "@angular/core";
import { ActionLogListItem, FaceMerchantClient } from "../../../services/admin.api.client";
import { ActivatedRoute } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { AppService } from "../../../services/app.service";

@Component({
  selector: 'app-face-merchant-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})

export class FaceMerchantLogs {
  gridView: ActionLogListItem[];
  private merchantId;

  constructor(private faceMerchantClient: FaceMerchantClient, private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private appService: AppService
  ) {
    this.titleService.setTitle('Face მერჩანტი | ლოგები');
    this.appService.setTitle('Face მერჩანტი | ლოგები');
    this.activatedRoute.params.subscribe(p => {
      this.merchantId = p['id'];
    });

    this.faceMerchantClient.getFaceMerchantLogs(this.merchantId)
      .subscribe((r: ActionLogListItem[]) => {
        this.gridView = r;
      });
  }
}
