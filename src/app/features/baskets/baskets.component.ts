import { Component, OnInit, ViewChild } from "@angular/core";
import { GridDataComponentBase } from "../../helpers/grid.data.component.base";
import { Location } from "@angular/common";
import { NavigationEnd, Router } from "@angular/router";
import { AppService } from "../../services/app.service";
import { Title } from "@angular/platform-browser";
import { GridComponent, GridDataResult } from "@progress/kendo-angular-grid";
import { Subscription } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import * as moment from "moment";
import { Currency, DropDownListItemModel, PayByLinkBasketsClient, FileResponse } from "../../services/admin.api.client";
import { DownloadService } from "../../services/download.service";

@Component({
  selector: 'app-baskets',
  templateUrl: './baskets.component.html',
  styleUrls: ['./baskets.component.scss']
})

export class BasketsComponent extends GridDataComponentBase implements OnInit {
  @ViewChild('gridComponent', { static: true }) grid: GridComponent;

  gridView: GridDataResult;
  routerSubscription: Subscription;
  isLoading = true;

  basketStatuses: ReadonlyArray<{ key: string, status: number }>;
  currencyDropDownList: ReadonlyArray<{ key: string, currency: Currency }> = [
    { key: '', currency: null },
    { key: 'GEL', currency: Currency.GEL },
    { key: 'USD', currency: Currency.USD },
    { key: 'EUR', currency: Currency.EUR },
  ]

  constructor(
    public location: Location,
    public router: Router,
    private appService: AppService,
    private titleService: Title,
    private payByLinkBaskets: PayByLinkBasketsClient,
    private download: DownloadService
  ) {
    super({
      dir: "desc",
      field: "dateCreated"
    }, location, router);
    this.titleService.setTitle('კალათები');
    this.dataLoaderSubscription = this.dataLoaderObservable()
      .pipe(switchMap(() => {
        this.isLoading = true;
        return this.payByLinkBaskets.queryBaskets(
          this.getByField('merchantTradeName'),
          this.getByField('merchantExternalId'),
          this.getByField('name'),
          this.getByField('code'),
          this.getByField('currency'),
          this.getByField('amount'),
          this.getByField('dateCreatedFrom') ? moment(this.getByField('dateCreatedFrom')) : undefined,
          this.getByField('dateCreatedTo') ? moment(this.getByField('dateCreatedTo')) : undefined,
          this.getByField('status'),
          this.getByField('expirationDateFrom') ? moment(this.getByField('expirationDateFrom')) : undefined,
          this.getByField('expirationDateTo') ? moment(this.getByField('expirationDateTo')) : undefined,
          this.getByField('creator'),
          this.state.sort[0].dir,
          this.state.sort[0].field,
          this.state.skip / this.state.take,
          this.state.take,
        )
      }))
      .subscribe(res => {
        this.isLoading = false;
        this.gridView = { data: res.data, total: res.totalCount };
      });

    this.getBasketStatuses();
  }

  ngOnInit() {
    this.appService.setTitle('კალათები');
    super.initializeGrid(this.grid);
    this.dataLoaderSubject.next();
    this.routerSubscription = this.router.events
      .subscribe(route => {
        if (route instanceof NavigationEnd) {
          this.dataLoaderSubject.next();
        }
      })
  }

  private getBasketStatuses(): void {
    this.payByLinkBaskets.getBasketStatuses()
      .pipe(map((r: DropDownListItemModel[]): ({ key: string, status: number })[] => r.map((m: DropDownListItemModel) =>
      ({
        key: m.name,
        status: m.id
      })
      )))
      .subscribe((r) => {
        this.basketStatuses = [{ key: '', status: null }, ...r];
      })
  }

  export() {
    this.payByLinkBaskets.exportBaskets(
      this.getByField('merchantTradeName'),
      this.getByField('merchantExternalId'),
      this.getByField('name'),
      this.getByField('code'),
      this.getByField('currency'),
      this.getByField('amount'),
      this.getByField('dateCreatedFrom') ? moment(this.getByField('dateCreatedFrom')) : undefined,
      this.getByField('dateCreatedTo') ? moment(this.getByField('dateCreatedTo')) : undefined,
      this.getByField('status'),
      this.getByField('expirationDateFrom'),
      this.getByField('expirationDateTo'),
      this.getByField('creatorType'),
    ).subscribe((r: FileResponse) => {
      this.download.download(r);
    })
  }
}
