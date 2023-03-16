import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import {
  TransactionClient,
  TransactionDetailsModel,
  InitializerType,
} from "../../../services/admin.api.client";
import { DataStateChangeEvent, GridDataResult, PagerSettings, SortSettings } from "@progress/kendo-angular-grid";
import { Title } from "@angular/platform-browser";
import { AppService } from "../../../services/app.service";
import { OpenSnackbarService } from "../../../services/open-snackbar.service";
import { Subscription } from "rxjs";
import { DialogAction, DialogService } from "@progress/kendo-angular-dialog";
import { ConfirmActionComponent } from "../../../shared/components/confirm-action/confirm-action.component";
import { PartialRefundDialogComponent } from "../partial-refund-dialog/partial-refund-dialog.component";

@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.scss']
})
export class TransactionDetailsComponent implements OnInit, OnDestroy {
  InitializerType = InitializerType;

  pageable = <PagerSettings>{
    buttonCount: 5,
    info: true,
    type: 'numeric',
    pageSizes: [5],
    previousNext: true
  };
  pageSize = 5;
  sortable: SortSettings = {
    showIndexes: false,
    mode: "single"
  };
  public state: DataStateChangeEvent = {
    skip: 0,
    take: 5,
    filter: {
      filters: [],
      logic: "and"
    },
    sort: [{
      dir: "desc",
      field: "OperationDate"
    }]
  };
  transactionDetailsSubscription: Subscription;
  private transactionId: number = undefined;

  transactionDetailsModel: TransactionDetailsModel = {};
  operators: object[];
  transactionCancelDisabled = false;
  logsGridData: GridDataResult = new class implements GridDataResult {
    data: any[];
    total: number;
  };
  refundsGridData: GridDataResult = new class implements GridDataResult {
    data: any[];
    total: number;
  };
  apiLogsGridData: GridDataResult = new class implements GridDataResult {
    data: any[];
    total: number;
  };

  constructor(
    private route: ActivatedRoute,
    private transactionClient: TransactionClient,
    private titleService: Title,
    private appService: AppService,
    private openSnackbar: OpenSnackbarService,
    public dialogService: DialogService
  ) {
    this.titleService.setTitle('ტრანზაქცია | დეტალები');
    this.appService.setTitle('ტრანზაქცია | დეტალები')
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.transactionId = +params.get('id');
      this.appService.setUrl(`/transactions/${this.transactionId}/logs`);
      this.getTransactionDetails();
    });
  }

  private getTransactionDetails(): void {
    this.transactionDetailsSubscription = this.transactionClient.getTransaction(this.transactionId)
      .subscribe(res => {
        this.transactionDetailsModel = res;
        if (res.operatorContacts != '') {
          this.operators = JSON.parse(res.operatorContacts);
        }
        this.refundsGridData.data = this.transactionDetailsModel?.refunds ?? [];
        this.refundsGridData.total = this.transactionDetailsModel?.refunds?.length;
        this.transactionClient.getTransactionPaymentLogs(
          JSON.stringify(this.transactionId),
          this.transactionId,
          this.state.sort[0].dir,
          this.state.sort[0].field,
          this.state.skip / this.state.take,
          this.pageSize)
          .subscribe((r) => {
            this.logsGridData = { data: r.response.data, total: r.response.totalCount };
          })
      }
      );
  }

  changeState(event: DataStateChangeEvent) {
    this.state.skip = event.skip;
    this.state.take = event.take;
    this.transactionClient.getTransactionPaymentLogs(
      JSON.stringify(this.transactionId),
      this.transactionId,
      this.state.sort[0].dir,
      this.state.sort[0].field,
      this.state.skip / this.state.take,
      this.pageSize)
      .subscribe((r) => {
        this.logsGridData = { data: r.response.data, total: r.response.totalCount };
      })
  }

  transactionReverseOrRefund(): void {
    this.transactionCancelDisabled = true;
    const partialRefundDialog = this.dialogService.open({
      title: 'აირჩიეთ რეფანდის ტიპი',
      content: PartialRefundDialogComponent,
      width: 400
    })
    partialRefundDialog.content.instance.partialReadonly = (this.transactionDetailsModel.status === 13 && this.transactionDetailsModel.transactionType === 3);

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
                if (this.transactionDetailsModel.canBeReversed) {
                  this.reversal(amount);
                } else {
                  this.transactionClient.checkRefundLimits(this.transactionDetailsModel.id)
                    .subscribe(res => {
                      try {
                        if (res.message) {
                          this.refundIfLimitsExceeded(res.message, amount);
                        } else {
                          this.refund(amount);
                        }
                      } catch (e) {
                        console.log(e)
                      }
                    }, error => {
                      try {
                        this.transactionCancelDisabled = false;
                        this.openSnackbar.openSnackBarDanger(error.result.message);
                      } catch (e) {
                        console.log(e)
                      }
                    })
                }
              } else {
                this.transactionCancelDisabled = false;
              }
            });
        } else {
          this.transactionCancelDisabled = false;
        }
      })
  }

  checkInitializerType(type: InitializerType): boolean {
    return type === InitializerType[<unknown>(this.transactionDetailsModel.initializerType) as string]
  }

  buttonPermission(): string[] {
    return [this.transactionDetailsModel.canBeReversed ? 'R_TM_Reverse' : 'R_TM_Refund'];
  }

  changeTransactionStatus(status) {
    const dialogRef = this.dialogService.open({
      title: 'სტატუსის ცვლილება',
      content: ConfirmActionComponent,
      width: 400
    });
    dialogRef.content.instance.message = 'ტრანზაქციის სტატუსის ცვლილება';
    dialogRef.content.instance.amount = this.transactionDetailsModel.amount;
    dialogRef
      .result
      .subscribe((r: DialogAction) => {
        if (r.primary) {
          this.transactionClient.trasnactionChangeStatus(this.transactionId, status)
            .subscribe(() => {
              this.getTransactionDetails();
            }, error => {
              this.openSnackbar.openSnackBarDanger(error.result?.message);
            })
        }
      })
  }

  getApiLogs() {
    this.transactionClient.getTransactionApiLogs(this.transactionId)
      .subscribe((r) => {
        // console.log(r)
        this.apiLogsGridData.data = r;
        this.apiLogsGridData.total = r.length
      }, error => {
        this.openSnackbar.openSnackBarDanger(error.result.message);
      })
  }

  private refund(amount = undefined): void {
    this.transactionClient.refundTransaction(this.transactionDetailsModel.id, amount)
      .subscribe(() => {
        this.getTransactionDetails();
        this.transactionCancelDisabled = false;
        this.openSnackbar.openSnackBarSuccess('რეფანდი წარმატებით განხორციელდა');
      }, error => {
        this.transactionCancelDisabled = false;
        this.openSnackbar.openSnackBarDanger(error.result.message);
        this.getTransactionDetails();
      })
  }

  private reversal(amount = undefined): void {
    this.transactionClient.reverseTransaction(this.transactionDetailsModel.id, amount)
      .subscribe(() => {
        this.getTransactionDetails();
        this.transactionCancelDisabled = false;
        this.openSnackbar.openSnackBarSuccess('რევერსალი წარმატებით განხორციელდა');
      }, error => {
        this.transactionCancelDisabled = false;
        this.openSnackbar.openSnackBarDanger(error.result.message);
        this.getTransactionDetails();
      })
  }

  private refundIfLimitsExceeded(error, amount) {
    const dialogRef = this.dialogService.open({
      title: 'Refund',
      content: ConfirmActionComponent,
      width: 400
    });

    dialogRef.content.instance.message = error;
    dialogRef
      .result
      .subscribe((r: DialogAction) => {
        if (r.primary) {
          this.refund(amount);
        } else {
          this.transactionCancelDisabled = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.transactionDetailsSubscription
      .unsubscribe();
  }
}
