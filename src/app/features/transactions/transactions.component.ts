import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AppService } from "../../services/app.service";
import { Title } from "@angular/platform-browser";
import { FilterService, GridComponent } from "@progress/kendo-angular-grid";
import { DialogAction, DialogService } from "@progress/kendo-angular-dialog";
import { Location } from "@angular/common";
import { NavigationEnd, Router } from "@angular/router";
import {
  PaymentChannel,
  TransactionType,
  DropDownListItemModel,
  PaymentStatus,
  TransactionClient,
  RecurringPaymentType
} from "../../services/admin.api.client";
import * as moment from "moment";
import { GridDataComponentBase } from "../../helpers/grid.data.component.base";
import { DownloadService } from "../../services/download.service";
import { map, switchMap } from "rxjs/operators";
import { Observable, Subscription } from "rxjs";
import { OpenSnackbarService } from "../../services/open-snackbar.service";
import { ConfirmActionComponent } from "../../shared/components/confirm-action/confirm-action.component";
import { PartialRefundDialogComponent } from "./partial-refund-dialog/partial-refund-dialog.component";

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent extends GridDataComponentBase implements OnInit, OnDestroy {
  paymentTypeDropdownData: ReadonlyArray<{ key: string, paymentMethod: number }>;
  currencyDropdownData: ReadonlyArray<{ key: string, currency: number }>;

  readonly paymentChannelDropdownData: ReadonlyArray<{ key: string, paymentChannel: PaymentChannel }> = Object.freeze([
    { key: '', paymentChannel: null },
    { key: 'თიბისი ონლაინ', paymentChannel: PaymentChannel.TbcMobile },
    { key: 'TPay', paymentChannel: PaymentChannel.Tpay }
  ]);
  readonly transactionTypeDropdownData: ReadonlyArray<{ key: string, transactionType: TransactionType }> = Object.freeze([
    { key: '', transactionType: null },
    { key: 'ავტორიზაცია', transactionType: TransactionType.SMS },
    { key: 'პრეავტორიზაცია', transactionType: TransactionType.DMS }
  ]);
  readonly paymentStatusDropdownData: ReadonlyArray<{ key: string, paymentStatus: PaymentStatus }> = Object.freeze([
    { key: '', paymentStatus: null },
    { key: 'Created', paymentStatus: PaymentStatus.Created },
    { key: 'Processing', paymentStatus: PaymentStatus.Processing },
    { key: 'Succeeded', paymentStatus: PaymentStatus.Succeeded },
    { key: 'Failed', paymentStatus: PaymentStatus.Failed },
    { key: 'AutoReversalProcessing', paymentStatus: PaymentStatus.AutoReversalProcessing },
    { key: 'AutoReversed', paymentStatus: PaymentStatus.AutoReversed },
    { key: 'Expired', paymentStatus: PaymentStatus.Expired },
    { key: 'ExpirationProcessing', paymentStatus: PaymentStatus.ExpirationProcessing },
    { key: 'CancelPaymentProcessing', paymentStatus: PaymentStatus.CancelPaymentProcessing },
    { key: 'WaitingConfirm', paymentStatus: PaymentStatus.WaitingConfirm },
    { key: 'PaymentCompletionProcessing ', paymentStatus: PaymentStatus.PaymentCompletionProcessing },
    { key: 'PartiallyReturned', paymentStatus: PaymentStatus.PartiallyReturned },
    { key: 'Returned', paymentStatus: PaymentStatus.Returned },
    { key: 'Deleted', paymentStatus: PaymentStatus.Deleted }
  ]);
  isBnplEnabledDropDownList: ReadonlyArray<{ key: string, isBnpl: boolean }> = [
    { key: '', isBnpl: null },
    { key: 'კი', isBnpl: true },
    { key: 'არა', isBnpl: false },
  ]
  readonly initiatorDropDownList: ReadonlyArray<{ key: string, initiator: RecurringPaymentType}> = Object.freeze([
    { key: '', initiator: null },
    { key: 'None', initiator: RecurringPaymentType.None },
    { key: 'Client', initiator: RecurringPaymentType.Client },
    { key: 'Merchant', initiator: RecurringPaymentType.Merchant },
  ]);

  isDataLoading = false;
  summaryAmount: number;
  private routerSubscription: Subscription;

  constructor(
    private appService: AppService,
    private titleService: Title,
    private dialogService: DialogService,
    public location: Location,
    public router: Router,
    private transactionClient: TransactionClient,
    private filterService: FilterService,
    private download: DownloadService,
    private openSnackbar: OpenSnackbarService
  ) {
    super({
      dir: "desc",
      field: "createDate"
    }, location, router);
    this.titleService.setTitle('ტრანზაქციები');
    this.filterService.changes
      .subscribe(r => {
        this.change(this.state);
        this.dataLoaderSubject.next();
      });
    this.dataLoaderSubscription = this.dataLoaderObservable()
      .pipe(switchMap(() => {
        this.isDataLoading = true;
        return this.transactionClient.queryTransactions(
          this.getByField("transactionId"),
          this.getByField("customerIp"),
          parseFloat(this.getByField("amount")),
          parseInt(this.getByField("currency")),
          parseFloat(this.getByField("confirmedAmount")),
          parseFloat(this.getByField("returnAmount")),
          this.getByField("description"),
          this.getByField("paymentMerchantId"),
          this.getByField("paymentMerchantName"),
          this.getByField("companyIdentificationNumber"),
          this.getByField("rrn"),
          this.getByField("createDateFrom") ? moment(this.getByField("createDateFrom")) : undefined,
          this.getByField("createDateTo") ? moment(this.getByField("createDateTo")) : undefined,
          parseInt(this.getByField("paymentStatus")),
          this.getByField("userInfo"),
          this.getByField("isBnpl"),
          this.getByField("terminalNo"),
          this.getByField("physicalTerminalNo"),
          this.getByField('initiator'),
          this.getByField("responseCode"),
          this.getByField("paymentGenId"),
          this.getByField("parentPaymentGenId"),
          parseInt(this.getByField("paymentChannel")),
          parseInt(this.getByField("paymentMethod")),
          parseInt(this.getByField("transactionType")),
          this.getByField("qRCode"),
          this.getByField("operatorContact"),
          this.getByField("hadCancellationProblem"),
          this.getByField("merchantPaymentId"),
          parseInt(this.getByField("paymentType")),
          parseInt(this.getByField("paymentObjectType")),
          this.getByField("initializerType"),
          parseInt(this.getByField('payByLinkProductId')),
          parseInt(this.getByField('payByLinkBasketId')),
          this.state.sort[0].dir,
          this.state.sort[0].field,
          this.state.skip / this.state.take,
          this.state.take
        )
      }))
      .subscribe(v => {
        this.gridData = { data: v.response.data, total: v.response.totalCount };
        this.summaryAmount = v.summaryAmount;
        this.isDataLoading = false;
      }, e => {
        this.isDataLoading = false;
      });

    this.getPaymentMethods();
    this.getCurrencies();
  }

  @ViewChild('gridComponent', { static: true }) grid: GridComponent;

  ngOnInit() {
    this.appService.setTitle('ტრანზაქციები');
    super.initializeGrid(this.grid);
    this.dataLoaderSubject.next();
    this.routerSubscription = this.router.events
      .subscribe(route => {
        if (route instanceof NavigationEnd) {
          this.dataLoaderSubject.next();
        }
      });
  }

  exportTransactions() {
    this.transactionClient.exportTransactions(
      this.getByField("transactionId"),
      this.getByField("customerIp"),
      parseFloat(this.getByField("amount")),
      parseInt(this.getByField("currency")),
      parseFloat(this.getByField("confirmedAmount")),
      parseFloat(this.getByField("returnAmount")),
      this.getByField("description"),
      this.getByField("paymentMerchantId"),
      this.getByField("paymentMerchantName"),
      this.getByField("companyIdentificationNumber"),
      this.getByField("rrn"),
      this.getByField("createDateFrom") ? moment(this.getByField("createDateFrom")) : undefined,
      this.getByField("createDateTo") ? moment(this.getByField("createDateTo")) : undefined,
      parseInt(this.getByField("paymentStatus")),
      this.getByField("userInfo"),
      this.getByField("isBnpl"),
      this.getByField("terminalNo"),
      this.getByField("physicalTerminalNo"),
      this.getByField('initiator'),
      this.getByField("responseCode"),
      this.getByField("paymentGenId"),
      this.getByField("parentPaymentGenId"),
      parseInt(this.getByField("paymentChannel")),
      parseInt(this.getByField("paymentMethod")),
      parseInt(this.getByField("transactionType")),
      this.getByField("qRCode"),
      this.getByField("operatorContact"),
      this.getByField("hadCancellationProblem"),
      this.getByField("merchantPaymentId"),
      parseInt(this.getByField("paymentType")),
      parseInt(this.getByField("paymentObjectType"))
    )
      .subscribe(res => {
        this.download.download(res)
      })
  }

  transactionReverseOrRefund(id: number, canBeReversed: boolean): void {
    const partialRefundDialog = this.dialogService.open({
      title: 'აირჩიე რეფანდის ტიპი',
      content: PartialRefundDialogComponent,
      width: 400
    });

    partialRefundDialog
      .result
      .subscribe((r: { primary: boolean, refundType: string, refundAmount: string }) => {
        if (r.primary) {
          const amount = r.refundAmount;
          const dialogRef = this.dialogService.open({
            title: 'Reversal/Refund',
            content: ConfirmActionComponent,
            width: 400
          });
          dialogRef.content.instance.message = 'ტრანზაქციის რევერსალი/რეფანდი';
          dialogRef
            .result
            .subscribe((r: DialogAction) => {
              if (r.primary) {
                if (canBeReversed) {
                  this.transactionClient.reverseTransaction(id, parseFloat(amount) ?? undefined)
                    .subscribe(() => {
                      this.dataLoaderSubject.next();
                      this.openSnackbar.openSnackBarSuccess('რევერსალი წარმატებით განხორციელდა');
                    }, error => {
                      this.openSnackbar.openSnackBarDanger(error.result.message);
                    })
                } else {
                  this.transactionClient.refundTransaction(id, parseFloat(amount) ?? undefined)
                    .subscribe(() => {
                      this.dataLoaderSubject.next();
                      this.openSnackbar.openSnackBarSuccess('რეფანდი წარმატებით განხორციელდა');
                    }, error => {
                      this.openSnackbar.openSnackBarDanger(error.result.message);
                    })
                }
              }
            })
        }
      })
  }

  buttonPermission(canBeReversed: boolean): string[] {
    return [canBeReversed ? 'R_TM_Reverse' : 'R_TM_Refund'];
  }

  private getPaymentMethods(): void {
    this.transactionClient.getPaymentMethods()
      .pipe(map((r: DropDownListItemModel[]): ({ key: string, paymentMethod: number })[] => r.map((m: DropDownListItemModel) =>
      ({
        key: m.name,
        paymentMethod: m.id
      })
      )))
      .subscribe(r => {
        this.paymentTypeDropdownData = [{ key: '', paymentMethod: null }, ...r];
      })
  }

  private getCurrencies(): void {
    this.transactionClient.getCurrencies()
      .pipe(map((r: DropDownListItemModel[]): ({ key: string, currency: number })[] => r.map((m: DropDownListItemModel) =>
      ({
        key: m.name,
        currency: m.id
      })
      )))
      .subscribe(r => {
        this.currencyDropdownData = [{ key: '', currency: null }, ...r];
      })
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.routerSubscription
      .unsubscribe();
  }
}
