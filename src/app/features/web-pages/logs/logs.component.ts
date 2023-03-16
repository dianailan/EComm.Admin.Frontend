import { Component } from "@angular/core";
import { ActionLogListItem, WebPageClient } from "../../../services/admin.api.client";
import { ActivatedRoute } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { AppService } from "../../../services/app.service";

@Component({
  selector: 'app-web-page-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})

export class WebPageLogs {
  gridView: ActionLogListItem[];
  private webPageId;

  constructor(private webPageClient: WebPageClient, private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private appService: AppService
  ) {
    this.titleService.setTitle('ვებ-გვერდი | ლოგები');
    this.appService.setTitle('ვებ-გვერდი | ლოგები');
    this.activatedRoute.params.subscribe(p => {
      this.webPageId = p.id;
    });

    this.webPageClient.getWebPageLogs(this.webPageId)
      .subscribe((r: ActionLogListItem[]) => {
        this.gridView = r;
      });
  }
}
