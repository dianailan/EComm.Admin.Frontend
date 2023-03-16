import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AppService } from "../../services/app.service";
import { Title } from "@angular/platform-browser";
import {
  IdResponse,
  QRMerchantListItemPagingResponse,
  QRPaymentClient,
  ServiceStatus
} from "../../services/admin.api.client";
import { GridDataComponentBase } from "../../helpers/grid.data.component.base";
import { Location } from "@angular/common";
import { NavigationEnd, Router } from "@angular/router";
import { DialogService } from "@progress/kendo-angular-dialog";
import { GridComponent, GridDataResult } from "@progress/kendo-angular-grid";
import { switchMap } from "rxjs/operators";
import { Subscription } from "rxjs";
import { CheckCompanyNumberComponent } from "../../shared/components/check-company-number/check-company-number.component";
import { OpenSnackbarService } from "../../services/open-snackbar.service";
import * as moment from "moment";

@Component({
  selector: 'app-qr-payments',
  templateUrl: './qr-payments.component.html',
  styleUrls: ['./qr-payments.component.scss']
})
export class QrPaymentsComponent extends GridDataComponentBase implements OnInit, OnDestroy {
  readonly qrPaymentStatusDropDownData: ReadonlyArray<{ key: string, status: ServiceStatus }> = Object.freeze([
    { key: '', status: undefined },
    { key: 'აქტიური', status: ServiceStatus.Accepted },
    { key: 'დაბლოკილი', status: ServiceStatus.Blocked },
    { key: 'გაუქმებული', status: ServiceStatus.Declined },
    { key: 'მუშავდება', status: ServiceStatus.Pending }
  ]);

  @ViewChild('gridComponent', { static: true }) grid: GridComponent;
  isLoading = false;
  gridView: GridDataResult;
  private routerSubscription: Subscription;

  constructor(
    private appService: AppService,
    private titleService: Title,
    private qrPaymentClient: QRPaymentClient,
    public location: Location,
    public router: Router,
    public dialogService: DialogService,
    private snackBar: OpenSnackbarService
  ) {
    super({
      dir: "desc",
      field: "dateCreated"
    }, location, router);
    console.log('er0')
    this.titleService.setTitle('QR ობიექტები');
    this.dataLoaderSubscription = this.dataLoaderObservable()
      .pipe(switchMap(() => {
        this.isLoading = true;
        return this.qrPaymentClient.queryQRPayments(
          this.getByField('companyName'),
          this.getByField('companyIdentificationNumber'),
          this.getByField('status'),
          this.getByField('externalMerchantId'),
          this.getByField('tradeNameEn'),
          this.getByField('tradeNameKa'),
          this.getByField('dateCreatedFrom') ? moment(this.getByField('dateCreatedFrom')) : undefined,
          this.getByField('dateCreatedTo') ? moment(this.getByField('dateCreatedTo')) : undefined,
          this.state.sort[0].dir,
          this.state.sort[0].field,
          this.state.skip / this.state.take,
          this.state.take,
        )
      }))
      .subscribe((res: QRMerchantListItemPagingResponse) => {
        this.isLoading = false;
        this.gridView = { data: res.data, total: res.totalCount }
      }, error => {
        console.log(error)
      })
  }

  ngOnInit() {
    this.appService.setTitle('QR ობიექტები');
    super.initializeGrid(this.grid);
    this.dataLoaderSubject.next();
    this.routerSubscription = this.router.events
      .subscribe(route => {
        if (route instanceof NavigationEnd) {
          this.dataLoaderSubject.next();
        }
      })
  }

  searchByQrCode(code) {
    this.qrPaymentClient.findQrPaymentByQRCode(code)
      .subscribe((r: IdResponse) => {
        this.router.navigateByUrl(`qrpayments/${r.id}`)
          .then()
          .catch(e => {
            throw e;
          })
        // this.dataLoaderSubject.next()
      }, error => {
        this.snackBar.openSnackBarDanger(error.result.message);
      })
  }

  openDialog() {
    this.dialogService.open({
      title: 'შეამოწმე კომპანია',
      content: CheckCompanyNumberComponent
    })
      .result
      .subscribe((r: { primary: boolean, response }) => {
        if (r.primary) {
          const params = {
            juridicalName: r.response.juridicalName,
            identificationNumber: r.response.identificationNumber,
            id: r.response.id
          };
          this.router.navigate(['/qrpayments/registerQrPayment'], { queryParams: params })
            .then()
            .catch(e => {
              throw e;
            })
        }
      }, error => {
        this.snackBar.openSnackBarDanger(error.result.message);
      })
  }

  ngOnDestroy(): void {
    this.routerSubscription
      .unsubscribe();
  }
}
