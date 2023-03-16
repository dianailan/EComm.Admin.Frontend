import { Component } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, Subject, throwError } from "rxjs";
import {
  CompanyClient,
  IdResponse,
  MerchantPaymentLimit,
  MerchantType,
  FaceMerchantClient,
  RegisterFaceMerchantRequest,
  MerchantRefundLimit, MccCode
} from "../../../services/admin.api.client";
import { AppService } from "../../../services/app.service";
import { Title } from "@angular/platform-browser";
import { OpenSnackbarService } from "../../../services/open-snackbar.service";
import { companyModel } from "../../../shared/models/models";
import { MerchantService } from "../../../services/merchant.service";

@Component({
  selector: 'app-register-face-merchant',
  templateUrl: './register-face-merchant.component.html',
  styleUrls: ['./register-face-merchant.component.scss'],
})

export class RegisterFaceMerchantComponent {
  merchantPaymentLimit: MerchantPaymentLimit;
  merchantRefundLimit: MerchantRefundLimit;

  companyModel = companyModel;
  private faceMerchantModel: RegisterFaceMerchantRequest;

  mccCodes: MccCode[];

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
    private faceMerchantClient: FaceMerchantClient,
    private companyClient: CompanyClient,
    private appService: AppService,
    private titleService: Title,
    private openSnackBar: OpenSnackbarService,
    private router: Router,
    private merchantService: MerchantService) {
    this.titleService.setTitle('Face მერჩანტი | რეგისტრაცია');
    this.appService.setTitle('Face მერჩანტი');

    this.companyModel.identificationNumber = this.activatedRoute.snapshot.queryParams.identificationNumber;
    this.companyModel.juridicalName = this.activatedRoute.snapshot.queryParams.juridicalName;
    this.companyModel.id = parseInt(this.activatedRoute.snapshot.queryParams.id);

    this.companyClient.merchantPaymentDefaultLimits(MerchantType.FaceMerchant)
      .subscribe((r: MerchantPaymentLimit) => {
        this.merchantPaymentLimit = r;
      })

    this.companyClient.merchantRefundDefaultLimits(MerchantType.FaceMerchant)
      .subscribe((r: MerchantRefundLimit) => {
        this.merchantRefundLimit = r;
      }, error => {
        console.log(error)
      });

    this.companyClient.mccCodes()
      .subscribe(r => {
        this.mccCodes = r;
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

  registerFaceMerchant(event: FormGroup) {
    this.faceMerchantModel = this.merchantService.buildModel(event.value);
    this.faceMerchantClient.addFaceMerchantToCompany(this.companyModel.id, this.faceMerchantModel)
      .subscribe((r: IdResponse) => {
        this.router.navigateByUrl(`facemerchant/${r.id}`)
          .then()
          .catch(e => throwError(e))
      }, error => {
        this.openSnackBar.openSnackBarDanger(error.result.message);
      });
  }
}
