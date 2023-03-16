import { Component } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, Subject, throwError } from "rxjs";
import {
  CompanyClient,
  IdResponse,
  MerchantPaymentLimit,
  MerchantType,
  QRMerchantsClient,
  RegisterQRMerchantRequest,
  MerchantRefundLimit
} from "../../../services/admin.api.client";
import { AppService } from "../../../services/app.service";
import { Title } from "@angular/platform-browser";
import { OpenSnackbarService } from "../../../services/open-snackbar.service";
import { companyModel } from "../../../shared/models/models";
import { MerchantService } from "../../../services/merchant.service";

@Component({
  selector: 'app-register-qr-merchant',
  templateUrl: './register-qr-merchant.component.html',
  styleUrls: ['./register-qr-merchant.component.scss'],
})

export class RegisterQrMerchantComponent {
  merchantPaymentLimit: MerchantPaymentLimit;
  merchantRefundLimit: MerchantRefundLimit;

  companyModel = companyModel;
  private qrMerchantModel: RegisterQRMerchantRequest;

  public formSubmitEvent: Subject<boolean> = new Subject<boolean>();
  formGroup: FormGroup;
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

  constructor(private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private qrMerchantClient: QRMerchantsClient,
    private companyClient: CompanyClient,
    private appService: AppService,
    private titleService: Title,
    private openSnackBar: OpenSnackbarService,
    private router: Router,
    private merchantService: MerchantService) {
    this.titleService.setTitle('QR სალაროები | რეგისტრაცია');
    this.appService.setTitle('QR სალარო');

    this.companyModel.identificationNumber = this.activatedRoute.snapshot.queryParams.identificationNumber;
    this.companyModel.juridicalName = this.activatedRoute.snapshot.queryParams.juridicalName;
    this.companyModel.id = parseInt(this.activatedRoute.snapshot.queryParams.id);

    this.companyClient.merchantPaymentDefaultLimits(MerchantType.QrMerchant)
      .subscribe((r: MerchantPaymentLimit) => {
        this.merchantPaymentLimit = r;
      })

    this.companyClient.merchantRefundDefaultLimits(MerchantType.QrMerchant)
      .subscribe((r: MerchantRefundLimit) => {
        this.merchantRefundLimit = r;
      }, error => {
        console.log(error)
      });
  }

  formSubmit() {
    this.formSubmitEvent.next(true);
  }

  formSubmitSub(): Observable<any> {
    return this.formSubmitEvent.asObservable();
  }

  registerQrMerchant(event: FormGroup) {
    this.qrMerchantModel = this.merchantService.buildModel(event.value);

    this.qrMerchantClient.addQrMerchantToCompany(this.companyModel.id, this.qrMerchantModel)
      .subscribe((r: IdResponse) => {
        this.router.navigateByUrl(`qrmerchant/${r.id}`)
          .then()
          .catch(e => throwError(e))
      }, error => {
        this.openSnackBar.openSnackBarDanger(error.result.message);
      });
  }
}
