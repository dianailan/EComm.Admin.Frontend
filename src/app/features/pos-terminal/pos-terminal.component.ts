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
import { OpenSnackbarService } from 'src/app/services/open-snackbar.service';
import * as moment from 'moment';
import { CheckCompanyNumberComponent } from 'src/app/shared/components/check-company-number/check-company-number.component';
import { PosQRTerminalClient, ServiceStatus } from 'src/app/services/admin.api.client';
import { IsPosqrAcceptedComponent } from 'src/app/shared/components/is-posqr-accepted/is-posqr-accepted.component';
import { PosQRClient } from 'src/app/services/admin.api.client';
import { Clipboard } from '@angular/cdk/clipboard'

@Component({
  selector: 'app-pos-terminal',
  templateUrl: './pos-terminal.component.html',
  styleUrls: ['./pos-terminal.component.scss']
})
export class PosTerminalComponent extends GridDataComponentBase implements OnInit, OnDestroy {
  readonly webPageStatusDropDownData: ReadonlyArray<{ key: string, status: ServiceStatus }> = Object.freeze([
    { key: '', status: undefined },
    { key: 'აქტიური', status: ServiceStatus.Accepted },
    { key: 'დაბლოკილი', status: ServiceStatus.Blocked },
    { key: 'გაუქმებული', status: ServiceStatus.Declined },
    { key: 'მუშავდება', status: ServiceStatus.Pending }
  ]);
  isBnplEnabledDropDownList: ReadonlyArray<{ key: string, isBnplEnabled: boolean }> = [
    { key: '', isBnplEnabled: null },
    { key: 'კი', isBnplEnabled: true },
    { key: 'არა', isBnplEnabled: false },
  ]

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
    private posQrTerminalClient: PosQRTerminalClient,
    location: Location,
    public router: Router,
    public dialogService: DialogService,
    private posQrClient: PosQRClient,
    private clipboard: Clipboard,
    private snackBar: OpenSnackbarService
  ) {
    super({
      dir: "desc",
      field: "dateCreated"
    }, location, router);

    this.titleService.setTitle('POS QR Terminal')
    this.dataLoaderSubscription = this.dataLoaderObservable()
      .pipe(switchMap(() => {
        this.isLoading = true;
        return this.posQrTerminalClient.queryPosQRTerminal(
          this.getByField('terminalNo'),
          this.getByField('physicalTerminalNo'),
          this.getByField('isBnplEnabled'),
          this.getByField('status'),
          this.getByField('dateCreatedFrom') ? moment(this.getByField('dateCreatedFrom')) : undefined,
          this.getByField('dateCreatedTo') ? moment(this.getByField('dateCreatedTo')) : undefined,
          this.getByField('companyName'),
          this.getByField('tradeName'),
          this.getByField('externalMerchantId'),
          this.getByField('companyId'),
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

  ngOnInit(): void {
    this.appService.setTitle('POS QR Terminal');

    super.initializeGrid(this.grid);
    this.dataLoaderSubject.next();
    this.routerSubscription = this.router.events
      .subscribe(route => {
        if (route instanceof NavigationEnd) {
          this.dataLoaderSubject.next();
        }
      })
  }

  public close(): void {
    this.opened = false;
  }

  public open(posqrMerchantId: number): void {
    this.opened = true;

    this.posQrClient.clientSecret(posqrMerchantId).subscribe(res => {
      this.clientId = res.clientId;
      this.clientSecret = res.clientSecret;
    });
  }

  copySecret() {
    this.clipboard.copy(this.clientSecret);
    this.snackBar.openSnackBarSuccess('Client Secret დაკოპირებულია')
  }

  copyId() {
    this.clipboard.copy(this.clientId);
    this.snackBar.openSnackBarSuccess('Client ID დაკოპირებულია')
  }

  openDialog() {
    this.dialogService.open({
      title: 'შეამოწმე POS QR მერჩანტი',
      content: IsPosqrAcceptedComponent
    })
      .result.subscribe((r: { primary: boolean, response, id }) => {
        if (r.primary) {
          const params = {
            id: r.response.id,
            merchantId: r.id
          };
          this.router.navigate([`/posterminal/registerPosTerminal`], { queryParams: params })
            .then()
            .catch(e => {
              throw e;
            })
        }
      })
  }

  ngOnDestroy(): void {
    this.routerSubscription
      .unsubscribe();
  }
}
