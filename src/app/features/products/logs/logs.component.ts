import { Component } from "@angular/core";
import { ActionLogListItem, PayByLinkProductsClient } from "../../../services/admin.api.client";
import { ActivatedRoute } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { AppService } from "../../../services/app.service";

@Component({
  selector: 'app-product-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})

export class LogsComponent {
  gridView: ActionLogListItem[];
  private productId;

  constructor(private payByLinkProducts: PayByLinkProductsClient, private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private appService: AppService
  ) {
    this.titleService.setTitle('პროდუქტი | ლოგები');
    this.appService.setTitle('პროდუქტი | ლოგები');
    this.appService.setUrl('');
    this.activatedRoute.params.subscribe(p => {
      this.productId = p['id'];
    });

    this.payByLinkProducts.getProductLogs(this.productId)
      .subscribe((r: ActionLogListItem[]) => {
        this.gridView = r;
      });
  }
}
