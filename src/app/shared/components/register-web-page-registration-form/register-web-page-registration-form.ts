import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import { Observable } from "rxjs";
import { FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from "@angular/forms";
import { MccCode, WebPageDropDownItem, MerchantPaymentLimit, PaymentMethod, MerchantRefundLimit, PaymentCurrency, RegisterWebPageRequest } from "../../../services/admin.api.client";
import { cwd } from 'process';

@Component({
  selector: 'app-web-page-registration-form',
  templateUrl: './register-web-page-registration-form.html',
  styleUrls: ['./register-web-page-registration-form.scss']
})

export class RegisterWebPageRegistrationForm implements OnInit {
  merchantPaymentLimit: MerchantPaymentLimit;
  merchantRefundLimit: MerchantRefundLimit;
  webpagePaymentMethods: PaymentMethod[];
  webpageCurrencies: PaymentCurrency[];
  registerWebPageReq: RegisterWebPageRequest;
  arrayControl: any;
  arrayControlItem;

  @Input() formSubmit: Observable<any>;
  @Input() mccCodes: MccCode[];
  @Input() masterWebPages: WebPageDropDownItem[];
  @Input() showMasterSelectBox: boolean;

  @Input()
  set paymentLimits(limits: MerchantPaymentLimit) {
    this.merchantPaymentLimit = limits;
    this.setDefaultLimits();
  }

  @Input()
  set refundLimits(limits: MerchantPaymentLimit) {
    this.merchantRefundLimit = limits;
    this.setDefaultRefundLimits();
  }

  @Input()
  set paymentMethods(methods: PaymentMethod[]) {
    this.webpagePaymentMethods = methods;
    this.setDefaultMethods();
  }

  @Input()
  set currencies(currencies: PaymentCurrency[]) {
    this.webpageCurrencies = currencies;
    this.setDefaultCurrencies();
  }

  @Output() form: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  formGroup: FormGroup;
  public submitted = false;

  BusinessField = [
    { value: "CharityAndNGO", text: "საქველმოქმედო ორგანიზაცია, ფონდი, არასამთავრობო ორგანიზაციები" },
    { value: "PoliticalParties", text: "პოლიტიკური პარტიები და გაერთიანებები" },
    { value: "Gambling", text: "აზარტული თამაშები/თამაშებთან დაკავშირებული საქმიანობა" },
    { value: "Tourism", text: "ტურიზმის სფერო" },
    { value: "Auction", text: "აუქციონი და აუქციონის სახლები" },
    { value: "Jewelry", text: "ძვირადღირებული და ძვირფასი საქონლის დილერები" },
    { value: "CryptoCurrency", text: "კრიპტოვალუტასთან დაკავშირებული საქმიანობა" },
    { value: "OtherTrades", text: "სხვა ვაჭრობის სფერო" },
    { value: "Hotels", text: "სასტუმრო, ჰოსტელი, აპარტამენტი" },
    { value: "VehicleRent", text: "ავტომობილების გაქირავება" },
    { value: "Brokers", text: "უძრავ-მოძრავი ქონების აგენტები და ბროკერები" },
    { value: "MicroFinance", text: "მიკროსაფინასო ორგანიზაცია" },
    { value: "OtherServices", text: "სხვა მომსახურება" }
  ];

  constructor(private formBuilder: FormBuilder) {
    this.buildFormGroup();

    this.arrayControl = this.formGroup.get('paymentMethods') as FormArray;
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
            if (this.formGroup.controls['isRecurringEnabled'].value === null) {
              this.formGroup.controls['isRecurringEnabled'].setValue(false);
            }
            this.form.emit(this.formGroup)
          }
        }
      )
  }

  get paymentMethodsFormArray() {
    return this.formGroup.get('paymentMethods') as FormArray;
  }
  addItemToPaymentMethods(item) {
    this.paymentMethodsFormArray.push(this.formBuilder.control(parseInt(item)));
  }
  removeItemFromPaymentMethods(item) {
    this.paymentMethodsFormArray.removeAt(this.paymentMethodsFormArray.value.indexOf(parseInt(item)));
  }

  get currenciesFormArray() {
    return this.formGroup.get('currencies') as FormArray;
  }
  addItemToCurrencies(item) {
    this.currenciesFormArray.push(this.formBuilder.control(item));
  }
  removeItemFromCurrencies(item) {
    this.currenciesFormArray.removeAt(this.currenciesFormArray.value.indexOf(item));
  }

  public buildFormGroup() {
    this.formGroup = this.formBuilder.group({
      address: [null, { validators: [Validators.required, this.validateUrl], updateOn: "blur" }],
      canRefund: [false],
      isRecurringEnabled: [this.registerWebPageReq?.isRecurringEnabled],
      recurringType: [{ value: 0, disabled: true }],
      isBnplEnabled: [false],
      isPayByLinkEnabled: [false],
      tradeName: ['', [Validators.required, Validators.maxLength(27), Validators.pattern("^[A-Za-z0-9!\"#$%&'()*+,-.\\\\//:;<=>?@\\[\\]^_`{|}~]*$")]],
      mccCodeId: [null],
      paymentMerchantExternalId: [null, [Validators.pattern("^[0-9]*$")]],
      paymentLimit: this.formBuilder.group({
        transaction: [this.merchantPaymentLimit?.transaction, [Validators.pattern("[+-]?([0-9]*[.])?[0-9]+"), Validators.maxLength(16)]],
        day: [this.merchantPaymentLimit?.daily, [Validators.pattern("[+-]?([0-9]*[.])?[0-9]+"), Validators.maxLength(16)]],
        month: [this.merchantPaymentLimit?.monthly, [Validators.pattern("[+-]?([0-9]*[.])?[0-9]+"), Validators.maxLength(16)]],
      }),
      refundLimit: this.formBuilder.group({
        day: [this.merchantRefundLimit?.daily, [Validators.pattern("[+-]?([0-9]*[.])?[0-9]+"), Validators.maxLength(16)]],
        month: [this.merchantRefundLimit?.monthly, [Validators.pattern("[+-]?([0-9]*[.])?[0-9]+"), Validators.maxLength(16)]],
      }),
      paymentMethods: this.formBuilder.array([]),
      currencies: this.formBuilder.array([]),
      masterWebPageId: [],
    })
  }

  onRecurringStatus(event) {
    if (event.target.checked) {
      this.formGroup.controls['recurringType'].enable();
      this.formGroup.controls['recurringType'].setValue(0);
    } else {
      this.formGroup.controls['recurringType'].disable();
    }
  }
  private setDefaultLimits() {
    this.formGroup.get('paymentLimit').patchValue({
      transaction: this.merchantPaymentLimit?.transaction,
      day: this.merchantPaymentLimit?.daily,
      month: this.merchantPaymentLimit?.monthly
    })
  }

  private validateUrl(control: FormControl): ValidationErrors | null {
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

  private setDefaultRefundLimits() {
    this.formGroup.get("refundLimit").patchValue({
      day: this.merchantRefundLimit?.daily,
      month: this.merchantRefundLimit?.monthly
    });
  }

  addMethodToArray(event): void {
    if(event.target.value == 4 && !event.target.checked){
      this.formGroup.get('isBnplEnabled').setValue(false);
      this.formGroup.get('isBnplEnabled').disable();
    }else if(event.target.value == 4 && event.target.checked){
      this.formGroup.get('isBnplEnabled').enable();
    }

    if (event.target.checked) {
      this.addItemToPaymentMethods(event.target.value);
    } else {
      this.removeItemFromPaymentMethods(event.target.value);
    }
  }

  addCurrencyToArray(event): void {
    if (event.target.checked) {
      this.addItemToCurrencies(event.target.value);
    } else {
      this.removeItemFromCurrencies(event.target.value);
    }
  }

  canRefundChange(event) {
    if (this.formGroup.get('canRefund').value) {
      this.formGroup.get('refundLimit').get('day').setValidators([Validators.pattern("[+-]?([0-9]*[.])?[0-9]+"), Validators.maxLength(16)]);
      this.formGroup.get('refundLimit').get('month').setValidators([Validators.pattern("[+-]?([0-9]*[.])?[0-9]+"), Validators.maxLength(16)]);
      this.formGroup.get('refundLimit').get('day').updateValueAndValidity();
      this.formGroup.get('refundLimit').get('month').updateValueAndValidity();
    } else {
      this.formGroup.get('refundLimit').get('day').setValidators([Validators.pattern("[+-]?([0-9]*[.])?[0-9]+"), Validators.maxLength(16)]);
      this.formGroup.get('refundLimit').get('month').setValidators([Validators.pattern("[+-]?([0-9]*[.])?[0-9]+"), Validators.maxLength(16)]);
      this.formGroup.get('refundLimit').get('day').updateValueAndValidity();
      this.formGroup.get('refundLimit').get('month').updateValueAndValidity();
    }
  }

  private setDefaultMethods(): void {
    this.webpagePaymentMethods?.forEach(el => {
      if (el.isEnabled) {
        this.addItemToPaymentMethods(el.payMethod)
      }
    });
  }

  private setDefaultCurrencies(): void {
    this.webpageCurrencies?.forEach(el => {
      if (el.isEnabled) {
        this.addItemToCurrencies(el.currency)
      }
    });
  }
}
