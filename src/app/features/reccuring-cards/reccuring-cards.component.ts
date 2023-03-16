import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AppService } from "../../services/app.service";
import { Title } from "@angular/platform-browser";
import { GridDataComponentBase } from "../../helpers/grid.data.component.base";
import { NavigationEnd, Router } from "@angular/router";
import { Location } from '@angular/common'
import { GridComponent, GridDataResult } from "@progress/kendo-angular-grid";
import {
  CardClient,
  CardStatus,
  CertificateClient,
  CreditCardStatus,
  RecurringCardClient, RecurringCardStatus, RecurringCardType, RecurringType
} from "../../services/admin.api.client";
import { DownloadService } from "../../services/download.service";
import { switchMap } from "rxjs/operators";
import { Subscription } from "rxjs";
import * as moment from "moment";

@Component({
  selector: 'app-reccuring-cards',
  templateUrl: './reccuring-cards.component.html',
  styleUrls: ['./reccuring-cards.component.scss']
})
export class ReccuringCardsComponent extends GridDataComponentBase implements OnInit, OnDestroy {
  readonly ReccuringCardTypeDropDownData: ReadonlyArray<{ key: string, cardType: RecurringCardType }> = Object.freeze([
    { key: '', cardType: undefined },
    { key: 'Unknown', cardType: RecurringCardType.Unknown },
    { key: 'Regular', cardType: RecurringCardType.Regular },
    { key: 'TBC', cardType: RecurringCardType.TBC },
  ]);

  readonly ReccuringCardStatusDropDownData: ReadonlyArray<{ key: string, status: RecurringCardStatus }> = Object.freeze([
    { key: '', status: undefined },
    { key: 'აქტიური', status: RecurringCardStatus.Active },
    { key: 'შექმნილი', status: RecurringCardStatus.Create },
    { key: 'წაშლილი', status: RecurringCardStatus.Deleted },
  ]);

  readonly ReccuringTypeDropDownData: ReadonlyArray<{ key: string, recurringType: RecurringType }> = Object.freeze([
    { key: '', recurringType: undefined },
    { key: 'SMS', recurringType: RecurringType.SMS },
    { key: 'DMS', recurringType: RecurringType.DMS },
  ]);

  public gridView: GridDataResult;
  public isLoading = false;
  private routerSubscription: Subscription;
  @ViewChild('gridComponent', { static: true }) grid: GridComponent;

  constructor(
    private appService: AppService,
    private titleService: Title,
    public router: Router,
    public location: Location,
    private recurringCardClient: RecurringCardClient,
    private download: DownloadService
  ) {
    super({
      dir: "desc",
      field: "dateCreated"
    }, location, router);
    this.titleService.setTitle('დამახსოვრებული ბარათები');

    this.dataLoaderSubscription = this.dataLoaderObservable()
      .pipe(switchMap(() => {
        this.isLoading = true;
        return this.recurringCardClient.queryRecurringCards(
          this.getByField('merchantExternalId'),
          this.getByField('tradeName'),
          this.getByField('paymentGenId'),
          this.getByField('payId'),
          this.getByField('cardMask'),
          this.getByField('status'),
          this.getByField('cardType'),
          this.getByField('recurringType'),
          this.getByField('from') ? moment(this.getByField('from')) : undefined,
          this.getByField('to') ? moment(this.getByField('to')) : undefined,
          this.getByField('expiryDate_from') ? moment(this.getByField('expiryDate_from')) : undefined,
          this.getByField('expiryDate_to') ? moment(this.getByField('expiryDate_to')) : undefined,
          this.state.sort[0].dir,
          this.state.sort[0].field,
          this.state.skip / this.state.take,
          this.state.take,
        )
      }))
      .subscribe(res => {
        this.isLoading = false;
        this.gridView = { data: res.data, total: res.totalCount };
      })
  }

  ngOnInit() {
    this.appService.setTitle('დამახსოვრებული ბარათები');
    super.initializeGrid(this.grid);
    this.dataLoaderSubject.next();
    this.routerSubscription = this.router.events
      .subscribe(route => {
        if (route instanceof NavigationEnd) {
          this.dataLoaderSubject.next();
        }
      })
  }

  exportTransactions() {
    this.recurringCardClient.exportRecurringCards(
      this.getByField('merchantExternalId'),
      this.getByField('merchantTradename'),
      this.getByField('paymentGenId'),
      this.getByField('payId'),
      this.getByField('expiryDate'),
      this.getByField('cardMask'),
      this.getByField('status'),
      this.getByField('cardType'),
      this.getByField('createdAtFrom') ? moment(this.getByField('createdAtFrom')) : undefined,
      this.getByField('createdAtTo') ? moment(this.getByField('createdAtTo')) : undefined,
    )
      .subscribe(res => {
        this.download.download(res);
      })
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.routerSubscription
      .unsubscribe();
  }
}
