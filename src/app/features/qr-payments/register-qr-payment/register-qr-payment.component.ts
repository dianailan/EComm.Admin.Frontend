import { Component } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { AppService } from "../../../services/app.service";
import {
  CompanyClient,
  IdResponse,
  MerchantPaymentLimit,
  MerchantType,
  QRPaymentClient,
  RegisterQRPaymentRequest,
  MerchantRefundLimit
} from "../../../services/admin.api.client";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, Subject } from "rxjs";
import { OpenSnackbarService } from "../../../services/open-snackbar.service";
import { MerchantService } from "../../../services/merchant.service";

@Component({
  selector: 'app-register-qr-payment',
  templateUrl: './register-qr-payment.component.html',
  styleUrls: ['./register-qr-payment.component.scss']
})

export class RegisterQrPaymentComponent {
  public formSubmitEvent: Subject<boolean> = new Subject<boolean>();

  merchantPaymentLimit: MerchantPaymentLimit;
  merchantRefundLimit: MerchantRefundLimit;

  companyModel = {
    juridicalName: '',
    identificationNumber: '',
    id: 0
  };
  private qrPaymentModel: RegisterQRPaymentRequest;

  constructor(
    private titleService: Title,
    private appService: AppService,
    private activatedRoute: ActivatedRoute,
    private qrPaymentClient: QRPaymentClient,
    private router: Router,
    private openSnackbar: OpenSnackbarService,
    private companyClient: CompanyClient,
    private merchantService: MerchantService
  ) {
    this.titleService.setTitle('QR ობიექტები');
    this.appService.setTitle('QR ობიექტები');
    this.companyModel.identificationNumber = this.activatedRoute.snapshot.queryParams.identificationNumber;
    this.companyModel.juridicalName = this.activatedRoute.snapshot.queryParams.juridicalName;
    this.companyModel.id = parseInt(this.activatedRoute.snapshot.queryParams.id);

    this.companyClient.merchantPaymentDefaultLimits(MerchantType.QrPayment)
      .subscribe((r: MerchantPaymentLimit) => {
        this.merchantPaymentLimit = r;
      }, error => {
        console.log(error)
      })

    this.companyClient.merchantRefundDefaultLimits(MerchantType.QrPayment)
      .subscribe((r: MerchantRefundLimit) => {
        this.merchantRefundLimit = r;
      }, error => {
        console.log(error)
      })
  }

  formSubmit() {
    this.formSubmitEvent.next(true);
  }

  formSubmitSub(): Observable<any> {
    return this.formSubmitEvent.asObservable();
  }

  registerQrPayment(event) {
    this.qrPaymentModel = this.merchantService.buildModel(event.value);
    this.qrPaymentClient.addQRPaymentToCompany(this.companyModel.id, this.qrPaymentModel)
      .subscribe((r: IdResponse) => {
        this.router.navigateByUrl(`qrpayments/${r.id}`)
          .then()
          .catch(e => {
            throw e;
          })
      }, error => {
        this.openSnackbar.openSnackBarDanger(error.result.message);
      })
  }
}
