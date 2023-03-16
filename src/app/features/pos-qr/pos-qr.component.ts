import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AppService } from "../../services/app.service";
import { Title } from "@angular/platform-browser";
import { GridDataComponentBase } from "../../helpers/grid.data.component.base";
import { switchMap } from "rxjs/operators";
import { GridComponent, GridDataResult } from "@progress/kendo-angular-grid";
import { Location } from "@angular/common";
import { NavigationEnd, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { DialogService } from "@progress/kendo-angular-dialog";
import * as moment from 'moment';
import { CheckCompanyNumberComponent } from 'src/app/shared/components/check-company-number/check-company-number.component';
import { PosQRClient, ServiceStatus } from 'src/app/services/admin.api.client';
import { Clipboard } from '@angular/cdk/clipboard';
import { OpenSnackbarService } from 'src/app/services/open-snackbar.service';
import { DownloadService } from "../../services/download.service";

@Component({
  selector: 'app-pos-qr',
  templateUrl: './pos-qr.component.html',
  styleUrls: ['./pos-qr.component.scss']
})
export class PosQrComponent extends GridDataComponentBase implements OnInit, OnDestroy {
  readonly webPageStatusDropDownData: ReadonlyArray<{ key: string, status: ServiceStatus }> = Object.freeze([
    { key: '', status: undefined },
    { key: 'აქტიური', status: ServiceStatus.Accepted },
    { key: 'დაბლოკილი', status: ServiceStatus.Blocked },
    { key: 'გაუქმებული', status: ServiceStatus.Declined },
    { key: 'მუშავდება', status: ServiceStatus.Pending }
  ]);

  private routerSubscription: Subscription;

  @ViewChild('gridComponent', { static: true }) grid: GridComponent;
  isLoading = false;
  gridView: GridDataResult;
  public opened = false;
  clientId: string = '';
  clientSecret: string = '';

  constructor(
    private appService: AppService,
    private titleService: Title,
    private posQrMerchantClient: PosQRClient,
    location: Location,
    public router: Router,
    public dialogService: DialogService,
    private clipboard: Clipboard,
    private download: DownloadService,
    private snackBar: OpenSnackbarService,
    private posQrClient: PosQRClient

  ) {
    super({
      dir: "desc",
      field: "dateCreated"
    }, location, router);

    this.titleService.setTitle('POS QR')
    this.dataLoaderSubscription = this.dataLoaderObservable()
      .pipe(switchMap(() => {
        this.isLoading = true;
        return this.posQrMerchantClient.queryPosQR(
          this.getByField('merchantExternalId'),
          this.getByField('tradeName'),
          this.getByField('companyIdentificationNumber'),
          this.getByField('status'),
          this.getByField('dateCreatedFrom') ? moment(this.getByField('dateCreatedFrom')) : undefined,
          this.getByField('dateCreatedTo') ? moment(this.getByField('dateCreatedTo')) : undefined,
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
  }
  public close(): void {
    this.opened = false;
  }

  public open(id: number): void {
    this.opened = true;

    this.posQrClient.clientSecret(id).subscribe(res => {
      this.clientId = res.clientId;
      this.clientSecret = res.clientSecret;
    });
  }

  copySecret() {
    this.clipboard.copy(this.clientSecret);
    this.snackBar.openSnackBarSuccess('Client Secret დაკოპირებულია');
  }

  copyId() {
    this.clipboard.copy(this.clientId);
    this.snackBar.openSnackBarSuccess('Client ID დაკოპირებულია');
  }

  ngOnInit(): void {
    this.appService.setTitle('POS QR');

    super.initializeGrid(this.grid);
    this.dataLoaderSubject.next();
    this.routerSubscription = this.router.events
      .subscribe(route => {
        if (route instanceof NavigationEnd) {
          this.dataLoaderSubject.next();
        }
      })
  }

  openDialog() {
    this.dialogService.open({
      title: 'შეამოწმე კომპანია',
      content: CheckCompanyNumberComponent
    })
      .result.subscribe((r: { primary: boolean, response }) => {
        if (r.primary) {
          const params = {
            juridicalName: r.response.juridicalName,
            identificationNumber: r.response.identificationNumber,
            id: r.response.id
          };
          this.router.navigate([`/posqr/registerPosQr`], { queryParams: params })
            .then()
            .catch(e => {
              throw e;
            })
        }
      })
  }

  exportPosQrMerchant(): void {
    this.posQrClient.exportPosMerchants(
      this.getByField('externalMerchantId'),
        this.getByField('tradeName'),
        this.getByField('companyIdentificationNumber'),
        this.getByField('status'),
        this.getByField('createdAtFrom') ? moment(this.getByField('createdAtFrom')) : undefined,
        this.getByField('createdAtTo') ? moment(this.getByField('createdAtTo')) : undefined,
    ).subscribe(r => {
          this.download.download(r);
      }, error => {
          console.log(error);
    });
  }

  ngOnDestroy(): void {
    this.routerSubscription
      .unsubscribe();
  }
}
