import { Component, OnDestroy, ViewChild, AfterViewInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { forkJoin, Observable, Subject } from "rxjs";
import {
  CompanyClient,
  MccCode, MerchantPaymentLimit, PaymentMethod,
  RegisterCompanyRequest, WebPageClient,
  MerchantRefundLimit,
  PaymentCurrency
} from "../../../services/admin.api.client";
import { OpenSnackbarService } from "../../../services/open-snackbar.service";
import { userModel } from "../../../shared/models/models";
import { MerchantService } from "../../../services/merchant.service";
import { RegisterPosQrRegistrationFormComponent } from "src/app/shared/components/register-pos-qr-merchant-registration-form/register-pos-qr-registration-form/register-pos-qr-registration-form.component";

@Component({
  selector: 'app-register-company',
  templateUrl: './register-company.component.html',
  styleUrls: ['./register-company.component.scss']
})

export class RegisterCompanyComponent implements AfterViewInit{
  @ViewChild(RegisterPosQrRegistrationFormComponent) set pq(posqrForm: RegisterPosQrRegistrationFormComponent){ 
    posqrForm?.formGroup?.valueChanges.subscribe(res => {
      this.isTerminalFilled = (res.terminal.terminalNo && res.terminal.physicalTerminalNo) && (res.terminal.physicalTerminalNo.length === 8) ? false : true;

      if(res.tradeName && res.mccCodeId){
        this.isTerminalBtnDisabled = (res.paymentMerchantExternalId && !this.onlyDigitsRegExp.test(res.paymentMerchantExternalId)) ? true : false;
      }else{
        this.isTerminalBtnDisabled = true;
      }

      this.merchantExternalId = res.paymentMerchantExternalId;
    })
  }
  merchantPaymentLimit: MerchantPaymentLimit;
  merchantRefundLimit: MerchantRefundLimit;
  merchantExternalId: string;
  onlyDigitsRegExp = /^[0-9]+$/;
  isTerminalBtnDisabled: boolean = true;
  webpagePaymentMethods: PaymentMethod[];
  webpageCurrencies: PaymentCurrency[];
  isTerminalFilled: boolean = true;
  public formSubmitEvent: Subject<boolean> = new Subject<boolean>();
  mccCodes: MccCode[];
  registerViewModel: RegisterCompanyRequest;

  waitingForResponse = false;

  companyFormGroup: FormGroup;
  nextPage = false;
  submitted = false;
  isRegisterTerminalPage: boolean = false;

  userInfo = userModel;

  constructor(private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private companyClient: CompanyClient,
    private snackBar: OpenSnackbarService,
    private router: Router,
    private merchantService: MerchantService,
    private webPageClient: WebPageClient) {
    this.getUserInfo();
    this.companyFormGroup = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(256)]],
      identificationNumber: ['', [Validators.required, Validators.pattern("[0-9]+"), Validators.minLength(9), Validators.maxLength(11)]],
      clientNo: [null, [Validators.pattern("[0-9]+")]],
      email: ['', [Validators.required, Validators.maxLength(50)]],
      address: ['', [Validators.required]],
      merchantType: [1]
    });

    this.companyFormGroup.get('merchantType').valueChanges
      .subscribe(value => {
        if (value === 4) {
          this.companyFormGroup.get('clientNo').setValidators([Validators.pattern("[0-9]+"), Validators.required]);
        } else {
          this.companyFormGroup.get('clientNo').setValidators([Validators.pattern("[0-9]+")])
        }
        this.companyFormGroup.get('clientNo').updateValueAndValidity();
      })
    // this.getState();

  }

  formSubmit() {
    this.formSubmitEvent.next(true);
  }

  formSubmitSub(): Observable<any> {
    return this.formSubmitEvent.asObservable();
  }



  terminalPage(){
    if(this.merchantExternalId != null && this.merchantExternalId != '' ){
      this.companyClient.merchantWithSameMerchantIdExists(this.merchantExternalId).subscribe(() => {
        this.isRegisterTerminalPage = !this.isRegisterTerminalPage;
      }, error => {
        this.snackBar.openSnackBarDanger(error.result.message);
      })
    }else{
      this.isRegisterTerminalPage = !this.isRegisterTerminalPage;
    }
  }

  async next() {
    this.submitted = true;
    if (this.companyFormGroup.valid) {
      if (this.companyFormGroup.get('merchantType').value !== 5) {
        this.merchantPaymentLimit = await this.companyClient.merchantPaymentDefaultLimits(this.companyFormGroup.get('merchantType').value).toPromise();
        this.merchantRefundLimit = await this.companyClient
          .merchantRefundDefaultLimits(this.companyFormGroup.get('merchantType').value).toPromise();
      }

      if (this.companyFormGroup.get('merchantType').value == 1) {
        this.mccCodes = await this.getMccCodes();
        this.webpagePaymentMethods = await this.webPageClient.getDefaultPaymentMethods().toPromise();
        this.webpageCurrencies = await this.webPageClient.getDefaultCurrencies().toPromise();
      }

      if (this.companyFormGroup.get('merchantType').value == 4) {
        this.mccCodes = await this.getMccCodes();
      }

      if (this.companyFormGroup.get('merchantType').value == 5) {
        this.mccCodes = await this.getMccCodes();
      }

      if (this.companyFormGroup.get('identificationNumber').value && this.companyFormGroup.get('clientNo').value) {
        forkJoin([
          this.companyClient.companyWithSameIdExists(this.companyFormGroup.get('identificationNumber').value),
          this.companyClient.companyWithSameClientNoExists(this.companyFormGroup.get('clientNo').value)
        ])
          .subscribe(() => {
            this.nextPage = true;
          }, error => {
            this.snackBar.openSnackBarDanger(error.result.message);
          })
      } else {
        this.companyClient.companyWithSameIdExists(this.companyFormGroup.get('identificationNumber').value)
          .subscribe(() => {
            this.nextPage = true;
          }, error => {
            this.snackBar.openSnackBarDanger(error.result.message);
          })
      }
    }
  }

  prev() {
    this.submitted = false;
    this.nextPage = false;
    if(this.isRegisterTerminalPage){
      this.nextPage = true;
    }

    this.isRegisterTerminalPage = false;
    localStorage.setItem('next_page', JSON.stringify(this.nextPage))
  }

  async getAdditionalFormValue(event: FormGroup) {
    await this.buildCompanyModel(event.value);
    this.companyClient.registerCompany(this.registerViewModel)
      .subscribe(r => {
        this.router.navigate([`/companies/` + r])
          .then()
          .catch(e => {
            throw e;
          })
      }, error => {
        this.snackBar.openSnackBarDanger(error.result.message);
      });
  }

  private buildCompanyModel(formValue) {
    const type = this.companyFormGroup.get('merchantType').value;
    let typeValue;
    if (type == 1) {
      typeValue = 'webPage'
    } else if (type == 2) {
      typeValue = 'qrPayment'
    } else if (type == 3) {
      typeValue = 'qrMerchant'
    } else if (type == 4) {
      typeValue = 'faceMerchant'
    } else if (type == 5) {
      typeValue = 'posQrMerchant'
    }

    this.registerViewModel = this.companyFormGroup.value;
    this.registerViewModel.userId = this.userInfo.userId;
    this.registerViewModel[typeValue] = this.merchantService.buildModel(formValue);
  }

  private getUserInfo() {
    this.userInfo.name = `${this.activatedRoute.snapshot.queryParams.firstName} ${this.activatedRoute.snapshot.queryParams.lastName}`;
    this.userInfo.phone = this.activatedRoute.snapshot.queryParams.phone;
    this.userInfo.email = this.activatedRoute.snapshot.queryParams.email;
    this.userInfo.userId = parseInt(this.activatedRoute.snapshot.queryParams.id);
    this.userInfo.clientNo = this.activatedRoute.snapshot.queryParams.clientNo;
  }

  async getMccCodes(): Promise<MccCode[]> {
    return await this.companyClient.mccCodes().toPromise()
  }

  ngAfterViewInit(): void {
  }
  // private saveFormState() {
  //   localStorage.setItem('company_form', JSON.stringify(this.companyFormGroup.value));
  //   localStorage.setItem('next_page', JSON.stringify(this.nextPage));
  // }

  // private getState() {
  //   const form = JSON.parse(localStorage.getItem('company_form'));
  //   const page = JSON.parse(localStorage.getItem('next_page'));
  //   if(form) {
  //     this.companyFormGroup.setValue(form);
  //   }
  //   if(page) {
  //     this.nextPage = page;
  //     if(this.nextPage) {
  //       this.next();
  //     }
  //   }
  // }
}
