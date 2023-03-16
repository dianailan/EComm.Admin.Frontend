import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import {
  CompanyClient,
  MccCode,
  QRMerchantDetails,
  QRMerchantsClient
} from "../../../services/admin.api.client";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { OpenSnackbarService } from "../../../services/open-snackbar.service";
import { forkJoin } from "rxjs";
import { Title } from "@angular/platform-browser";
import { AppService } from "../../../services/app.service";
import { ConfirmActionComponent } from "../../../shared/components/confirm-action/confirm-action.component";
import { DialogAction, DialogService } from "@progress/kendo-angular-dialog";

@Component({
  selector: 'app-qr-merchant-details',
  templateUrl: './qr-merchant-details.component.html',
  styleUrls: ['./qr-merchant-details.component.scss']
})
export class QrMerchantDetailsComponent implements OnInit {
  formGroup: FormGroup;
  editMode = false;
  public qrMerchantId: number;
  merchantDetails: QRMerchantDetails;
  mccCodeValue: string;
  submitted = false;
  mccCodes: MccCode[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private qrMerchantClient: QRMerchantsClient,
    private companyClient: CompanyClient,
    private formBuilder: FormBuilder,
    private snackBar: OpenSnackbarService,
    private titleService: Title,
    private appService: AppService,
    private dialogService: DialogService
  ) {
    this.titleService.setTitle('QR სალარო | დეტალები');
    this.appService.setTitle('QR სალარო | დეტალები');

    this.activatedRoute.params.subscribe(p => {
      this.qrMerchantId = p.id;
      this.appService.setUrl(`/qrmerchant/${this.qrMerchantId}/logs`)
    });
    this.formGroup = this.formBuilder.group({
      id: [this.qrMerchantId],
      limitPerTransaction: ['', [Validators.required, Validators.pattern("[+-]?([0-9]*[.])?[0-9]+"), Validators.maxLength(16)]],
      limitPerDay: ['', [Validators.required, Validators.pattern("[+-]?([0-9]*[.])?[0-9]+"), Validators.maxLength(16)]],
      limitPerMonth: ['', [Validators.required, Validators.pattern("[+-]?([0-9]*[.])?[0-9]+"), Validators.maxLength(16)]],
      tradeNameEn: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9,.\s]+$/)]],
      tradeNameKa: ['', [Validators.required, Validators.pattern(/^[ა-ჰ0-9,.\s]+$/)]],
      paymentMerchantExternalId: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      accountNumber: ['', [Validators.required, Validators.maxLength(22), Validators.minLength(22)]],
      mccCodeId: ['', [Validators.required]],
      canRefund: [false],
      refundLimitPerDay: ['', [Validators.pattern("[+-]?([0-9]*[.])?[0-9]+"), Validators.maxLength(16)]],
      refundLimitPerMonth: ['', [Validators.pattern("[+-]?([0-9]*[.])?[0-9]+"), Validators.maxLength(16)]]
    });

    this.getMerchantDetails();
  }

  ngOnInit() {
  }

  private getMccCodeValue() {
    this.mccCodes.forEach((el: MccCode) => {
      if (el.id === this.merchantDetails.mccCodeId) {
        this.mccCodeValue = `${el.code} - ${el.descriptionKa}`
      }
    })
  }

  private setFormGroupValue() {
    this.formGroup.setValue({
      id: this.qrMerchantId,
      limitPerTransaction: this.merchantDetails.limitPerTransaction,
      limitPerDay: this.merchantDetails.limitPerDay,
      limitPerMonth: this.merchantDetails.limitPerMonth,
      tradeNameEn: this.merchantDetails.tradeNameEn,
      tradeNameKa: this.merchantDetails.tradeNameKa,
      paymentMerchantExternalId: this.merchantDetails.paymentMerchantExternalId,
      accountNumber: this.merchantDetails.accountNumber,
      mccCodeId: this.merchantDetails.mccCodeId,
      canRefund: this.merchantDetails.canRefund,
      refundLimitPerDay: this.merchantDetails.refundLimit.daily,
      refundLimitPerMonth: this.merchantDetails.refundLimit.monthly
    })
  }

  setEditMode() {
    this.editMode = !this.editMode;
    this.submitted = false;
    if (!this.editMode) {
      this.setFormGroupValue();
    }
  }

  updateMerchant() {
    this.submitted = true;
    if (!this.formGroup.valid) {
      return;
    }
    this.qrMerchantClient.saveQRMerchant(this.formGroup.value)
      .subscribe(res => {
        this.getMerchantDetails();
        this.editMode = !this.editMode;
      }, error => {
        this.snackBar.openSnackBarDanger(error.result.message);
      })
  }

  updateMerchantStatus(id, status) {
    if (status === 2) {
      const dialogRef = this.dialogService.open({
        title: 'QR სალაროს გაუქმება',
        content: ConfirmActionComponent,
        width: 400
      });
      dialogRef.content.instance.message = '';
      dialogRef
        .result
        .subscribe((r: DialogAction) => {
          if (r.primary) {
            this.qrMerchantClient.changeQrMerchantStatus(id, status)
              .subscribe(r => {
                this.getMerchantDetails();
              }, error => {
                this.snackBar.openSnackBarDanger(error.result.message);
              })
          }
        })
      return;
    }
    this.qrMerchantClient.changeQrMerchantStatus(id, status)
      .subscribe(r => {
        this.getMerchantDetails();
      }, error => {
        this.snackBar.openSnackBarDanger(error.result.message);
      })
  }

  canRefundChange(event) {
    if (this.formGroup.get('canRefund').value) {
      this.formGroup.get('refundLimitPerDay').setValidators([Validators.required, Validators.pattern("[+-]?([0-9]*[.])?[0-9]+"), Validators.maxLength(16)]);
      this.formGroup.get('refundLimitPerDay').updateValueAndValidity();
      this.formGroup.get('refundLimitPerMonth').setValidators([Validators.required, Validators.pattern("[+-]?([0-9]*[.])?[0-9]+"), Validators.maxLength(16)]);
      this.formGroup.get('refundLimitPerMonth').updateValueAndValidity();
    } else {
      this.formGroup.get('refundLimitPerDay').setValidators([Validators.pattern("[+-]?([0-9]*[.])?[0-9]+"), Validators.maxLength(16)]);
      this.formGroup.get('refundLimitPerDay').updateValueAndValidity();
      this.formGroup.get('refundLimitPerMonth').setValidators([Validators.pattern("[+-]?([0-9]*[.])?[0-9]+"), Validators.maxLength(16)]);
      this.formGroup.get('refundLimitPerMonth').updateValueAndValidity();
    }
  }

  private getMerchantDetails() {
    forkJoin([this.qrMerchantClient.getQRMerchant(this.qrMerchantId), this.companyClient.mccCodes()]).subscribe(r => {
      this.merchantDetails = r[0];
      this.mccCodes = r[1];
      this.setFormGroupValue();
      this.getMccCodeValue();

      if (this.formGroup.get('canRefund').value) {
        this.formGroup.get('refundLimitPerDay').setValidators([Validators.required, Validators.pattern("[+-]?([0-9]*[.])?[0-9]+"), Validators.maxLength(16)]);
        this.formGroup.get('refundLimitPerMonth').setValidators([Validators.required, Validators.pattern("[+-]?([0-9]*[.])?[0-9]+"), Validators.maxLength(16)]);
      }
    });
  }
}
