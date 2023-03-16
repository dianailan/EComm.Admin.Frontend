import { Component } from "@angular/core";
import { ActionLogListItem, PayByLinkBasketsClient } from "../../../services/admin.api.client";
import { ActivatedRoute } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { AppService } from "../../../services/app.service";

@Component({
  selector: 'app-basket-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})

export class LogsComponent {
  gridView: ActionLogListItem[];
  private basketId;

  constructor(private payByLinkBaskets: PayByLinkBasketsClient, private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private appService: AppService
  ) {
    this.titleService.setTitle('კალათები | ლოგები');
    this.appService.setTitle('კალათები | ლოგები');
    this.appService.setUrl('');
    this.activatedRoute.params.subscribe(p => {
      this.basketId = p['id'];
    });

    this.payByLinkBaskets.getBasketLogs(this.basketId)
      .subscribe((r: ActionLogListItem[]) => {
        this.gridView = r;
      });
  }
}
