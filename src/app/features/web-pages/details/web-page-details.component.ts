import { Component, OnInit, ChangeDetectorRef, AfterContentChecked } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  CompanyClient,
  MccCode,
  MerchantRefundLimit,
  MerchantType,
  WebPageClient,
  WebPageDetails, WebPageDropDownItem
} from "../../../services/admin.api.client";
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from "@angular/forms";
import { OpenSnackbarService } from "../../../services/open-snackbar.service";
import { forkJoin } from "rxjs";
import { AppService } from "../../../services/app.service";
import { Title } from "@angular/platform-browser";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { ConfirmActionComponent } from "../../../shared/components/confirm-action/confirm-action.component";
import { DialogAction, DialogService } from "@progress/kendo-angular-dialog";

@Component({
  selector: 'app-web-page-details',
  templateUrl: './web-page-details.component.html',
  styleUrls: ['./web-page-details.component.scss']
})

export class PageDetails implements OnInit, AfterContentChecked {
  merchantCanRefund: boolean;
  //merchantOnTestLimit: boolean;

  formGroup: FormGroup;
  editMode = false;
  public webPageId: number;
  webPageDetails: WebPageDetails;
  mccCodeValue: string;
  submitted = false;
  mccCodes: MccCode[];
  masterWebPages: WebPageDropDownItem[];
  isDisabled = true;

  zeroTransactions: GridDataResult = new class implements GridDataResult {
    data: any[];
    total: number;
  };

  private enabledPaymentMethods = [];
  private enabledCurrencies = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private webPageClient: WebPageClient,
    private companyClient: CompanyClient,
    private formBuilder: FormBuilder,
    private snackBar: OpenSnackbarService,
    private appService: AppService,
    private titleService: Title,
    private dialogService: DialogService,
    private changeDetector: ChangeDetectorRef
  ) {
    this.titleService.setTitle('ვებ-გვერდი | დეტალები');

    this.activatedRoute.params.subscribe(p => {
      this.webPageId = p.id;
      this.appService.setUrl(`/webpages/${this.webPageId}/logs`)
    });

    this.formGroup = this.formBuilder.group({
      id: [this.webPageId],
      limitPerTransaction: ['', [Validators.required, Validators.pattern("[+-]?([0-9]*[.])?[0-9]+"), Validators.maxLength(16)]],
      limitPerDay: ['', [Validators.required, Validators.pattern("[+-]?([0-9]*[.])?[0-9]+"), Validators.maxLength(16)]],
      limitPerMonth: ['', [Validators.pattern("[+-]?([0-9]*[.])?[0-9]+"), Validators.maxLength(16)]],
      refundLimitPerDay: ['', [Validators.pattern("[+-]?([0-9]*[.])?[0-9]+"), Validators.maxLength(16)]],
      refundLimitPerMonth: ['', [Validators.pattern("[+-]?([0-9]*[.])?[0-9]+"), Validators.maxLength(16)]],
      tradeName: ['', [Validators.required, Validators.maxLength(27), Validators.pattern("^[A-Za-z0-9!\"#$%&'()*+,-.\\\\//:;<=>?@\\[\\]^_`{|}~]*$")]],
      paymentMerchantExternalId: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      mccCodeId: ['', [Validators.required]],
      masterWebPageId: [''],
      limitStatus: [],
      testLimit: ['', [Validators.pattern("[+-]?([0-9]*[.])?[0-9]+"), Validators.maxLength(16)]],
      canRefund: [false],
      isRecurringEnabled: [false],
      recurringType: [0],
      isSplitPaymentEnabled: [false],
      isPayByLinkEnabled: [false],
      isBnplEnabled: [false],
      updatePaymentMethods: [null],
      updateCurrencies: [null],
      webAddress: [null, { validators: [Validators.required, validateUrl], updateOn: "blur" }]
    });

    this.getWebPageDetails();
  }

  ngOnInit(): void {
    this.appService.setTitle('ვებ-გვერდი | დეტალები');
  }

  setEditMode() {
    this.editMode = !this.editMode;
    this.submitted = false;
    if (!this.editMode) {
      this.setFormGroupValue();
    }
    if (this.editMode) {
      //Set recurringType radio buttons to disabled if recurring is not enabled
      if (!this.webPageDetails.isRecurringEnabled) {
        this.formGroup.controls['recurringType'].disable();
      }
      //If edit mode is not on set recurringType radio button value to what recurring type is
      this.formGroup.controls['recurringType'].setValue(this.webPageDetails.recurringType.toString());
    }
  }
  changeRecurringType(event) {
    if (event.target.checked) {
      this.formGroup.controls['recurringType'].enable();
    } else {
      this.formGroup.controls['recurringType'].disable();
    }
  }
  updateWebPage() {
    this.submitted = true;
    if (!this.formGroup.valid) {
      return;
    }

    const data = {
      ...this.formGroup.value,
      recurringType: this.formGroup.get('isRecurringEnabled').value ? this.formGroup.get('recurringType').value : this.webPageDetails.recurringType
    }

    this.webPageClient.saveWebPage(data)
      .subscribe(res => {
        this.getWebPageDetails();
        this.editMode = !this.editMode;
      }, error => {
        this.snackBar.openSnackBarDanger(error.result.message);
      })
  }

  private getWebPageDetails() {
    forkJoin([
      this.webPageClient.getWebPage(this.webPageId),
      this.companyClient.mccCodes()])
      .subscribe(r => {
        this.webPageDetails = r[0];
        this.mccCodes = r[1];

        this.companyClient.getWebPageDropDownItems(this.webPageDetails.companyId, this.webPageDetails.id)
          .subscribe((res) => {
            this.masterWebPages = res;
          }, error => {
            this.snackBar.openSnackBarDanger(error.result.message);
          })
        this.setFormGroupValue();
        this.getMccCodeValue();
        this.getZeroTransactionLogs();

        this.merchantCanRefund = this.webPageDetails.canRefund;
        //this.merchantLimitStatus = this.webPageDetails.limitStatus;

        if (this.formGroup.get('canRefund').value) {
          this.formGroup.get('refundLimitPerDay').setValidators([Validators.pattern("[+-]?([0-9]*[.])?[0-9]+"), Validators.maxLength(16)]);
          this.formGroup.get('refundLimitPerMonth').setValidators([Validators.pattern("[+-]?([0-9]*[.])?[0-9]+"), Validators.maxLength(16)]);
        }
        if (this.formGroup.get('limitStatus').value === 1 || this.formGroup.get('limitStatus').value === 2) {
          this.formGroup.get('testLimit').setValidators([Validators.required, Validators.pattern("[+-]?([0-9]*[.])?[0-9]+"), Validators.maxLength(16)]);
        }
      });
  }

  private getZeroTransactionLogs() {
    this.webPageClient.getZeroTransactionLogs(this.webPageId)
      .subscribe((r) => {
        this.zeroTransactions.data = r;
        this.zeroTransactions.total = r.length
      }, error => {
        console.log(error)
        this.snackBar.openSnackBarDanger(error.result.text ?? 'ნულოვანი ავტორიზაცია ვერ ჩაიტვირთა');
      })
  }

  updateWebPageStatus(id, status) {
    if (status === 2) {
      const dialogRef = this.dialogService.open({
        title: 'ვებ-გვერდის გაუქმება',
        content: ConfirmActionComponent,
        width: 400
      });
      dialogRef.content.instance.message = '';
      dialogRef
        .result
        .subscribe((r: DialogAction) => {
          if (r.primary) {
            this.webPageClient.changeWebPageStatus(id, status)
              .subscribe(r => {
                this.getWebPageDetails();
              }, error => {
                this.snackBar.openSnackBarDanger(error.result.message);
                this.getZeroTransactionLogs();
              })
          }
        })
      return;
    }
    this.webPageClient.changeWebPageStatus(id, status)
      .subscribe(r => {
        this.getWebPageDetails();
      }, error => {
        this.snackBar.openSnackBarDanger(error.result.message);
        this.getZeroTransactionLogs();
      })
  }

  showConfirm() {
    return new Promise((resolve) => {
      const confirmDialog = this.dialogService.open({
        title: '',
        content: ConfirmActionComponent,
        width: 400
      });
      confirmDialog.content.instance.message = 'ტიპის შეცვლის შემთხვევაში, არსებული ავტორიზაციის ტიპით დამახსოვრებული ბარათები აღარ იმუშავებს. დარწმუნებული ხარ რომ გინდა შეცვლა?'
      confirmDialog.result.subscribe((res) => {
        resolve(res);
      });
    });
  }

  async onConfirmDialog(event) {
    const value = event.target.value;
    if ((true && value !== '0') || value !== '1') {
      event.preventDefault();
      let confirm = await this.showConfirm();
      if (confirm['primary'] === false) {
        return
      }
    }
    this.formGroup.controls['recurringType'].setValue(value);
  }
  canRefundChange(event) {
    if (this.formGroup.get('canRefund').value) {
      this.formGroup.get('refundLimitPerDay').setValidators([Validators.pattern("[+-]?([0-9]*[.])?[0-9]+"), Validators.maxLength(16)]);
      this.formGroup.get('refundLimitPerDay').updateValueAndValidity();
      this.formGroup.get('refundLimitPerMonth').setValidators([Validators.pattern("[+-]?([0-9]*[.])?[0-9]+"), Validators.maxLength(16)]);
      this.formGroup.get('refundLimitPerMonth').updateValueAndValidity();
      if (!this.merchantCanRefund) {
        this.updateRefundDefaultLimits();
      }
    } else {
      this.formGroup.get('refundLimitPerDay').setValidators([Validators.pattern("[+-]?([0-9]*[.])?[0-9]+"), Validators.maxLength(16)]);
      this.formGroup.get('refundLimitPerDay').updateValueAndValidity();
      this.formGroup.get('refundLimitPerMonth').setValidators([Validators.pattern("[+-]?([0-9]*[.])?[0-9]+"), Validators.maxLength(16)]);
      this.formGroup.get('refundLimitPerMonth').updateValueAndValidity();
    }
  }

  limitStatusChange(event) {
    if (this.formGroup.get('limitStatus').value === 1 || this.formGroup.get('limitStatus').value === 2) {
      this.formGroup.get('testLimit').setValidators([Validators.required, Validators.pattern("[+-]?([0-9]*[.])?[0-9]+"), Validators.maxLength(16)]);
      this.formGroup.get('testLimit').updateValueAndValidity();
      //if (!this.merchantOnTestLimit) {
      //  this.updateTestLimits();
      //}
    } else {
      this.formGroup.get('testLimit').setValidators([Validators.pattern("[+-]?([0-9]*[.])?[0-9]+"), Validators.maxLength(16)]);
      this.formGroup.get('testLimit').updateValueAndValidity();
    }
  }

  private setFormGroupValue() {
    try {
      this.formGroup.setValue({
        id: this.webPageId,
        limitPerTransaction: this.webPageDetails.limitPerTransaction,
        limitPerDay: this.webPageDetails.limitPerDay,
        limitPerMonth: this.webPageDetails.limitPerMonth,
        refundLimitPerDay: this.webPageDetails.refundLimit.daily,
        refundLimitPerMonth: this.webPageDetails.refundLimit.monthly,
        limitStatus: this.webPageDetails.limitStatus,
        testLimit: this.webPageDetails.testLimit,
        tradeName: this.webPageDetails.tradeName,
        paymentMerchantExternalId: this.webPageDetails.paymentMerchantExternalId,
        mccCodeId: this.webPageDetails.mccCodeId,
        masterWebPageId: this.webPageDetails.masterWebPage?.masterWebPageId ?? null,
        canRefund: this.webPageDetails.canRefund,
        isRecurringEnabled: this.webPageDetails.isRecurringEnabled,
        isBnplEnabled: this.webPageDetails.isBnplEnabled,
        recurringType: this.webPageDetails.recurringType,
        isSplitPaymentEnabled: this.webPageDetails.isSplitPaymentEnabled,
        isPayByLinkEnabled: this.webPageDetails.isPayByLinkEnabled,
        updatePaymentMethods: null,
        updateCurrencies: null,
        webAddress: this.webPageDetails.webAddress
      });

      this.enabledPaymentMethods = this.webPageDetails.paymentMethods.map(el => {
        
        if(el.payMethod == 4 && el.isEnabled){
          this.isDisabled = false;
        }

        if (el.isEnabled)
          return el.payMethod
      }) as number[];
      this.enabledPaymentMethods = this.enabledPaymentMethods.filter(el => el);

      this.enabledCurrencies = this.webPageDetails.paymentCurrencies.map(el => {
        if (el.isEnabled)
          return el.currency
      }) as number[];
      this.enabledCurrencies = this.enabledCurrencies.filter(el => el);
    } catch (e) {
      console.log(e)
    }
  }

  paymentMethodChange(event, method, prevValue) {
    try {
      const update = {
        paymentMethod: method,
        action: null
      };
      if (this.checkPaymentMethodLastCheckbox(event.target.value, event.target.checked)) {
        event.target.checked = true;
        return;
      }

      if(method === 4 && !event.target.checked){
        this.isDisabled = true;
        this.formGroup.get('isBnplEnabled').setValue(false);
      }else if(method === 4 && event.target.checked){
        this.isDisabled = false;
      }
      
      if (event.target.checked && !prevValue) {
        update.action = 0
      } else if (!event.target.checked && prevValue) {
        update.action = 1;
      } else {
        if (this.formGroup.get('updatePaymentMethods').value) {
          let filteredValue = this.formGroup.get('updatePaymentMethods').value.filter(el =>
            el.paymentMethod != method
          );
          this.formGroup.get('updatePaymentMethods').setValue(filteredValue.length > 0 ? filteredValue : null);
          return;
        }
      }
      const formValue = this.formGroup.get('updatePaymentMethods').value ?? [];
      this.formGroup.get('updatePaymentMethods').setValue([...formValue, update]);
    } catch (e) {
      console.log(e)
    }
  }

  private checkPaymentMethodLastCheckbox(value, checked) {
    const index = this.enabledPaymentMethods.indexOf(parseInt(value));
    if (index !== -1 && !checked) {
      if (this.enabledPaymentMethods.length === 1) {
        return true;
      }
      this.enabledPaymentMethods.splice(index, 1);
    } else if (index === -1 && checked) {
      this.enabledPaymentMethods.push(parseInt(value))
    }
    return false;
  }

  currencyChange(event, curr, prevValue) {
    try {
      const update = {
        currency: curr,
        action: null
      };
      if (this.checkCurrencyLastCheckbox(event.target.value, event.target.checked)) {
        event.target.checked = true;
        return;
      }

      if (event.target.checked && !prevValue) {
        update.action = 0
      } else if (!event.target.checked && prevValue) {
        update.action = 1;
      } else {
        if (this.formGroup.get('updateCurrencies').value) {
          let filteredValue = this.formGroup.get('updateCurrencies').value.filter(el =>
            el.currency != curr
          );
          this.formGroup.get('updateCurrencies').setValue(filteredValue.length > 0 ? filteredValue : null);
          return;
        }
      }
      const formValue = this.formGroup.get('updateCurrencies').value ?? [];
      this.formGroup.get('updateCurrencies').setValue([...formValue, update]);
    } catch (e) {
      console.log(e)
    }
  }

  private checkCurrencyLastCheckbox(value, checked) {
    const index = this.enabledCurrencies.indexOf(parseInt(value));
    if (index !== -1 && !checked) {
      if (this.enabledCurrencies.length === 1) {
        return true;
      }
      this.enabledCurrencies.splice(index, 1);
    } else if (index === -1 && checked) {
      this.enabledCurrencies.push(parseInt(value))
    }
    return false;
  }

  private getMccCodeValue() {
    try {
      this.mccCodes.forEach((el: MccCode) => {
        if (el.id === this.webPageDetails.mccCodeId) {
          this.mccCodeValue = `${el.code} ${el.descriptionKa}`
        }
      })
    } catch (e) {
      console.log(e)
    }
  }

  private updateRefundDefaultLimits() {
    this.companyClient.merchantRefundDefaultLimits(MerchantType.WebPage)
      .subscribe((r: MerchantRefundLimit) => {
        this.formGroup.patchValue({
          refundLimitPerDay: r.daily,
          refundLimitPerMonth: r.monthly
        });
      })
  }
  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }
}

export function validateUrl(control: FormControl): ValidationErrors | null {
  let valid = true;
  try {
    let str = control.value;

    if (str.indexOf('://') === -1) {
      str = `http://${str}`
      new URL(str);
      control.setValue(str);
    } else {
      new URL(control.value);
    }
  } catch {
    valid = false
  }
  return valid ? null : { invalidUrl: true }
}
