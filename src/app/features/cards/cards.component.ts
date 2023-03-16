import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AppService } from "../../services/app.service";
import { Title } from "@angular/platform-browser";
import { GridDataComponentBase } from "../../helpers/grid.data.component.base";
import { NavigationEnd, Router } from "@angular/router";
import { Location } from '@angular/common'
import { GridComponent, GridDataResult } from "@progress/kendo-angular-grid";
import { CardClient, CardStatus, CertificateClient, CreditCardStatus } from "../../services/admin.api.client";
import { DownloadService } from "../../services/download.service";
import { switchMap } from "rxjs/operators";
import { Subscription } from "rxjs";
import * as moment from "moment";

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent extends GridDataComponentBase implements OnInit, OnDestroy {
  readonly isTbcOnlineCardDropDownData: ReadonlyArray<{ key: string, isTbcOnlineCard: boolean }> = Object.freeze([
    { key: '', isTbcOnlineCard: undefined },
    { key: 'კი', isTbcOnlineCard: true },
    { key: 'არა', isTbcOnlineCard: false }
  ]);

  readonly isPrimaryDropDownData: ReadonlyArray<{ key: string, isPrimary: boolean }> = Object.freeze([
    { key: '', isPrimary: undefined },
    { key: 'კი', isPrimary: true },
    { key: 'არა', isPrimary: false }
  ]);

  // readonly productDropDownData: ReadonlyArray<{ key: string, product: CardType }> = Object.freeze([
  //   {key: '', product: undefined},
  //   {key: 'Unknown', product: CardType.Unknown},
  //   {key: 'Amex', product: CardType.Amex},
  //   {key: 'Visa', product: CardType.Visa},
  //   {key: 'MasterCard', product: CardType.MasterCard},
  //   {key: 'Maestro', product: CardType.Maestro},
  //   {key: 'LocalCard', product: CardType.Localcard}
  // ]);

  readonly CreditCardStatusDropDownData: ReadonlyArray<{ key: string, cardType: CreditCardStatus }> = Object.freeze([
    { key: '', cardType: undefined },
    { key: 'Unknown', cardType: CreditCardStatus.Unknown },
    { key: 'Credit', cardType: CreditCardStatus.Credit },
    { key: 'Debit', cardType: CreditCardStatus.Debit },
  ]);

  readonly CardStatusDropDownData: ReadonlyArray<{ key: string, cardStatus: CardStatus }> = Object.freeze([
    { key: '', cardStatus: undefined },
    //{key: 'Unknown', cardStatus: CardStatus.Unknown},
    { key: 'Active', cardStatus: CardStatus.Ok },
    { key: 'Inactive', cardStatus: CardStatus.Disabled },
    //{key: 'Failed', cardStatus: CardStatus.Failed},
    //{key: 'Expired', cardStatus: CardStatus.Expired},
    //{key: 'NeedsVerification', cardStatus: CardStatus.NeedsVerification},
    // {key: 'Blocked', cardStatus: CardStatus.Blocked},
    //{key: 'BlockedInUFC', cardStatus: CardStatus.BlockedInUFC},
    //{key: 'Deleted', cardStatus: CardStatus.Deleted},
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
    private cardsClient: CardClient,
    private download: DownloadService
  ) {
    super({
      dir: "desc",
      field: "createDate"
    }, location, router);
    this.titleService.setTitle('ბარათები');

    this.dataLoaderSubscription = this.dataLoaderObservable()
      .pipe(switchMap(() => {
        this.isLoading = true;
        return this.cardsClient.queryCards(
          this.getByField('userFullName'),
          this.getByField('clientNo'),
          this.getByField('personalId'),
          this.getByField('product'),
          this.getByField('cardType'),
          this.getByField('cardMask'),
          this.getByField('cardStatus'),
          this.getByField('isPrimary'),
          this.getByField('createdAtFrom') ? moment(this.getByField('createdAtFrom')) : undefined,
          this.getByField('createdAtTo') ? moment(this.getByField('createdAtTo')) : undefined,
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
    this.appService.setTitle('ბარათები');
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
    this.cardsClient.exportCards(
      this.getByField('userFullName'),
      this.getByField('clientNo'),
      this.getByField('personalId'),
      this.getByField('product'),
      this.getByField('cardType'),
      this.getByField('cardMask'),
      this.getByField('cardStatus'),
      this.getByField('isPrimary'),
      this.getByField('createdAtFrom') ? moment(this.getByField('createdAtFrom')) : undefined,
      this.getByField('createdAtTo') ? moment(this.getByField('createdAtTo')) : undefined
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
