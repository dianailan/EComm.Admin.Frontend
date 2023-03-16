import { Component } from "@angular/core";
import { ActionLogListItem, MerchantLogosClient, WebPageClient } from "../../../services/admin.api.client";
import { ActivatedRoute } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { AppService } from "../../../services/app.service";

@Component({
  selector: 'app-web-page-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})

export class MerchantLogoLogs {
  gridView: ActionLogListItem[];
  private logoId;

  constructor(private merchantLogosClient: MerchantLogosClient, private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private appService: AppService
  ) {
    this.titleService.setTitle('ლოგოები | ლოგები');
    this.appService.setTitle('ლოგოები | ლოგები');
    this.activatedRoute.params.subscribe(p => {
      this.logoId = p.id;
    });

    this.merchantLogosClient.getMerchantLogoLogs(this.logoId)
      .subscribe((r: ActionLogListItem[]) => {
        this.gridView = r;
      });
  }
}
