import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { businessField } from "../../../helpers/businessfield";
import { MerchantPaymentLimit, MerchantRefundLimit, MccCode } from "../../../services/admin.api.client";

@Component({
  selector: 'app-register-face-merchant-form',
  templateUrl: './register-face-merchant-registration-form.html',
  styleUrls: ['./register-face-merchant-registration-form.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class RegisterFaceMerchantRegistrationForm implements OnInit {
  merchantPaymentLimit: MerchantPaymentLimit;
  merchantRefundLimit: MerchantRefundLimit;

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

  @Input() formSubmit: Observable<any>;
  @Output() form: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  formGroup: FormGroup;
  BusinessField = businessField;
  @Input() mccCodes: MccCode[];

  public submitted = false;

  constructor(private formBuilder: FormBuilder) {
    this.formGroup = this.formBuilder.group({
      businessField: ['', [Validators.required]],
      tradeName: ['', [Validators.required, Validators.maxLength(27)]],
      description: ['', [Validators.minLength(15)]],
      address: ['', [Validators.required, Validators.max(200)]],
      merchantExternalId: ['', [Validators.required, Validators.maxLength(50)]],
      canRefund: [false],
      mccCodeId: [''],
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
    this.formGroup.get('paymentLimit').patchValue({
      transaction: this.merchantPaymentLimit?.transaction,
      day: this.merchantPaymentLimit?.daily,
      month: this.merchantPaymentLimit?.monthly
    });
  }

  private setDefaultRefundLimits() {
    this.formGroup.get('refundLimit').patchValue({
      day: this.merchantRefundLimit?.daily,
      month: this.merchantRefundLimit?.monthly
    });
  }
}
