import { Component, OnInit, ViewChild } from "@angular/core";
import { GridDataComponentBase } from "../../helpers/grid.data.component.base";
import { Location } from "@angular/common";
import { NavigationEnd, Router } from "@angular/router";
import {
  Currency,
  DropDownListItemModel,
  FileResponse,
  PayByLinkProductsClient,
  ProductListItemPagingResponse
} from "../../services/admin.api.client";
import { map, switchMap } from "rxjs/operators";
import * as moment from "moment";
import { Title } from "@angular/platform-browser";
import { GridComponent, GridDataResult } from "@progress/kendo-angular-grid";
import { AppService } from "../../services/app.service";
import { Subscription } from "rxjs";
import { DownloadService } from "../../services/download.service";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})

export class ProductsComponent extends GridDataComponentBase implements OnInit {
  @ViewChild('gridComponent', { static: true }) grid: GridComponent;
  gridView: GridDataResult;
  isLoading = true;
  routerSubscription: Subscription;

  productStatuses: ReadonlyArray<{ key: string, status: number }>;
  productTypes: ReadonlyArray<{ key: string, productType: number }>;
  currencyDropDownList: ReadonlyArray<{ key: string, currency: Currency }> = [
    { key: '', currency: null },
    { key: 'GEL', currency: Currency.GEL },
    { key: 'USD', currency: Currency.USD },
    { key: 'EUR', currency: Currency.EUR },
  ]
  isReusableDropDownList: ReadonlyArray<{ key: string, isReusable: boolean }> = [
    { key: '', isReusable: null },
    { key: 'კი', isReusable: true },
    { key: 'არა', isReusable: false },
  ]

  constructor(
    public location: Location,
    public router: Router,
    private payByLinkProducts: PayByLinkProductsClient,
    private titleService: Title,
    private appService: AppService,
    private download: DownloadService) {
    super({
      dir: "desc",
      field: "dateCreated"
    }, location, router);
    this.titleService.setTitle('პროდუქტები');
    this.dataLoaderSubscription = this.dataLoaderObservable()
      .pipe(switchMap(() => {
        this.isLoading = true;
        return this.payByLinkProducts.queryProducts(
          this.getByField('merchantTradeName'),
          this.getByField('merchantExternalId'),
          this.getByField('name'),
          this.getByField('code'),
          this.getByField('currency'),
          this.getByField('amount'),
          this.getByField('dateCreatedFrom') ? moment(this.getByField('dateCreatedFrom')) : undefined,
          this.getByField('dateCreatedTo') ? moment(this.getByField('dateCreatedTo')) : undefined,
          this.getByField('status'),
          this.getByField('productType'),
          this.getByField('maxQuantityPerBuy'),
          this.getByField('maxTotalQuantity'),
          this.getByField('isReusable'),
          this.state.sort[0].dir,
          this.state.sort[0].field,
          this.state.skip / this.state.take,
          this.state.take
        )
      }))
      .subscribe((res) => {
        this.mapDataList(res);
      });

    this.getProductStatuses();
    this.getProductTypes();
  }

  ngOnInit() {
    this.appService.setTitle('პროდუქტები');
    super.initializeGrid(this.grid);
    this.dataLoaderSubject.next();
    this.routerSubscription = this.router.events
      .subscribe(route => {
        if (route instanceof NavigationEnd) {
          this.dataLoaderSubject.next();
        }
      })
  }

  private getProductStatuses(): void {
    this.payByLinkProducts.getProductStatuses()
      .pipe(map((r: DropDownListItemModel[]): ({ key: string, status: number })[] => r.map((m: DropDownListItemModel) =>
      ({
        key: m.name,
        status: m.id
      })
      )))
      .subscribe((r) => {
        this.productStatuses = [{ key: '', status: null }, ...r];
      })
  }

  getImgUrl(imgUrl): string {
    return '/api/PayByLinkProducts/Image?fileName=' + imgUrl
  }

  private getProductTypes(): void {
    this.payByLinkProducts.getProductTypes()
      .pipe(map((r: DropDownListItemModel[]): ({ key: string, productType: number })[] => r.map((m: DropDownListItemModel) =>
      ({
        key: m.name,
        productType: m.id
      })
      )))
      .subscribe((r) => {
        this.productTypes = [{ key: '', productType: null }, ...r];
      })
  }

  private async mapDataList(data: ProductListItemPagingResponse) {
    try {
      this.isLoading = false;
      this.gridView = { data: data.data, total: data.totalCount };
    } catch (e) {
    }
  }

  private async getImagePath(fileName: string) {
    return await this.payByLinkProducts.getProductImage(fileName).toPromise()
  }

  export() {
    this.payByLinkProducts.exportProducts(
      this.getByField('merchantTradeName'),
      this.getByField('merchantExternalId'),
      this.getByField('name'),
      this.getByField('code'),
      this.getByField('currency'),
      this.getByField('amount'),
      this.getByField('dateCreatedFrom') ? moment(this.getByField('dateCreatedFrom')) : undefined,
      this.getByField('dateCreatedTo') ? moment(this.getByField('dateCreatedTo')) : undefined,
      this.getByField('productType'),
      this.getByField('maxQuantityPerBuy'),
      this.getByField('isReusable'),
      this.getByField('status')
    ).subscribe((r: FileResponse) => {
      this.download.download(r);
    })
  }
}
