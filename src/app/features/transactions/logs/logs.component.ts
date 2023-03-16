import { Component, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { TransactionClient } from "../../../services/admin.api.client";
import { Title } from "@angular/platform-browser";
import { AppService } from "../../../services/app.service";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-transaction-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})

export class TransactionLogs implements OnDestroy {
  gridView;
  private routeSub: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private transactionClient: TransactionClient,
    private titleService: Title,
    private appService: AppService) {
    this.titleService.setTitle('ტრანზაქცია | ლოგები');
    this.appService.setTitle('ტრანზაქცია | ლოგები');
    this.activatedRoute.params
      .subscribe(p => {
        const { id } = p;
        this.getTransactionLogs(id);
      })
  }

  private getTransactionLogs(transactionId) {
    this.routeSub = this.transactionClient.getTransactionLogs(transactionId)
      .subscribe(r => {
        this.gridView = r;
      })
  }

  ngOnDestroy(): void {
    this.routeSub
      .unsubscribe();
  }
}
