import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { businessField } from "../../../helpers/businessfield";
import { CompanyClient, MccCode, MerchantPaymentLimit, MerchantRefundLimit } from "../../../services/admin.api.client";

@Component({
  selector: 'app-register-qr-payment-registration-form',
  templateUrl: './register-qr-payment-registration-form.html',
  styleUrls: ['./register-qr-payment-registration-form.scss'],
})

export class RegisterQrPaymentRegistrationForm implements OnInit {
  merchantPaymentLimit: MerchantPaymentLimit;
  merchantRefundLimit: MerchantRefundLimit;

  @Input() formSubmit: Observable<any>;

  @Input()
  set paymentLimits(limits: MerchantPaymentLimit) {
    this.merchantPaymentLimit = limits;
    this.setDefaultLimits();
  }

  @Input()
  set refundLimits(limits: MerchantRefundLimit) {
    this.merchantRefundLimit = limits;
    this.setDefaultRefundLimits();
  }

  @Output() form: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  mccCodes: MccCode[];
  BusinessField = businessField;
  submitted = false;
  formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder, private companyClient: CompanyClient) {
    this.formGroup = this.formBuilder.group({
      businessField: ['', [Validators.required]],
      tradeName: ['', [Validators.required, Validators.pattern(/^[ა-ჰ0-9,.\s]+$/)]],
      tradeNameEn: ['', [Validators.pattern(/^[a-zA-Z0-9,.\s]+$/)]],
      description: [''],
      qrCode: [''],
      mccCodeId: [''],
      accountNumber: ['', [Validators.required, Validators.minLength(22)]],
      canRefund: [false],
      paymentLimit: this.formBuilder.group({
        transaction: [this.merchantPaymentLimit?.transaction, [Validators.pattern("[+-]?([0-9]*[.])?[0-9]+"), Validators.maxLength(16)]],
        day: [this.merchantPaymentLimit?.daily, [Validators.pattern("[+-]?([0-9]*[.])?[0-9]+"), Validators.maxLength(16)]],
        month: [this.merchantPaymentLimit?.monthly, [Validators.pattern("[+-]?([0-9]*[.])?[0-9]+"), Validators.maxLength(16)]],
      }),
      refundLimit: this.formBuilder.group({
        day: [this.merchantRefundLimit?.daily, [Validators.pattern("[+-]?([0-9]*[.])?[0-9]+"), Validators.maxLength(16)]],
        month: [this.merchantRefundLimit?.monthly, [Validators.pattern("[+-]?([0-9]*[.])?[0-9]+"), Validators.maxLength(16)]],
      })
    });
    this.companyClient.mccCodes()
      .subscribe((codes: MccCode[]) => {
        this.mccCodes = codes;
      })
  }

  ngOnInit(): void {
    this.formSubmit
      .subscribe(
        r => {
          if (r) {
            this.submitted = true;
            if (this.formGroup.invalid) {
              return;
            }
            this.form.emit(this.formGroup)
          }
        }
      )
  }

  canRefundChange(event) {
    if (this.formGroup.get('canRefund').value) {
      this.formGroup.get('refundLimit').get('day').setValidators([Validators.required, Validators.pattern("[+-]?([0-9]*[.])?[0-9]+"), Validators.maxLength(16)]);
      this.formGroup.get('refundLimit').get('month').setValidators([Validators.required, Validators.pattern("[+-]?([0-9]*[.])?[0-9]+"), Validators.maxLength(16)]);
      this.formGroup.get('refundLimit').get('day').updateValueAndValidity();
      this.formGroup.get('refundLimit').get('month').updateValueAndValidity();
    } else {
      this.formGroup.get('refundLimit').get('day').setValidators([Validators.pattern("[+-]?([0-9]*[.])?[0-9]+"), Validators.maxLength(16)]);
      this.formGroup.get('refundLimit').get('month').setValidators([Validators.pattern("[+-]?([0-9]*[.])?[0-9]+"), Validators.maxLength(16)]);
      this.formGroup.get('refundLimit').get('day').updateValueAndValidity();
      this.formGroup.get('refundLimit').get('month').updateValueAndValidity();
    }
  }

  private setDefaultLimits() {
    this.formGroup.get("paymentLimit").patchValue({
      transaction: this.merchantPaymentLimit?.transaction,
      day: this.merchantPaymentLimit?.daily,
      month: this.merchantPaymentLimit?.monthly
    });
  }

  private setDefaultRefundLimits() {
    this.formGroup.get("refundLimit").patchValue({
      day: this.merchantRefundLimit?.daily,
      month: this.merchantRefundLimit?.monthly
    });
  }
}
