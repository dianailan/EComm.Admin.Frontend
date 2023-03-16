import { Component, OnInit } from "@angular/core";
import {
  CompanyClient,
  IdResponse,
  MccCode,
  MerchantPaymentLimit,
  MerchantType, PaymentMethod,
  RegisterWebPageRequest,
  WebPageClient,
  MerchantRefundLimit,
  PaymentCurrency,

  WebPageDropDownItem
} from "../../../services/admin.api.client";
import { Observable, Subject, throwError } from "rxjs";
import { FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { OpenSnackbarService } from "../../../services/open-snackbar.service";
import { AppService } from "../../../services/app.service";
import { Title } from "@angular/platform-browser";
import { MerchantService } from "../../../services/merchant.service";

@Component({
  selector: 'app-register-web-page',
  templateUrl: './register-web-page.component.html',
  styleUrls: ['./register-web-page.component.scss'],
})

export class RegisterWebPage implements OnInit {
  public formSubmitEvent: Subject<boolean> = new Subject<boolean>();

  mccCodes: MccCode[];
  masterWebPages: WebPageDropDownItem[];

  merchantPaymentLimit: MerchantPaymentLimit;
  merchantRefundLimit: MerchantRefundLimit;

  payMethods: PaymentMethod[];
  currencies: PaymentCurrency[];

  companyModel = {
    juridicalName: '',
    identificationNumber: '',
    id: 0
  };
  private webPageModel: RegisterWebPageRequest;

  constructor(
    private webPageClient: WebPageClient,
    private router: Router,
    private openSnackBar: OpenSnackbarService,
    private activatedRoute: ActivatedRoute,
    private appService: AppService,
    private titleService: Title,
    private companyClient: CompanyClient,
    private merchantService: MerchantService
  ) {
    this.titleService.setTitle('Web Pages');
    this.companyModel.identificationNumber = this.activatedRoute.snapshot.queryParams.identificationNumber;
    this.companyModel.juridicalName = this.activatedRoute.snapshot.queryParams.juridicalName;
    this.companyModel.id = parseInt(this.activatedRoute.snapshot.queryParams.id, 0);

    this.companyClient.mccCodes()
      .subscribe((r: MccCode[]) => {
        this.mccCodes = r;
      }, error => {
        console.log(error)
      });

    this.companyClient.getWebPageDropDownItems(this.companyModel.id)
      .subscribe((r: WebPageDropDownItem[]) => {
        this.masterWebPages = r;
      }, error => {
        console.log(error)
      });

    this.companyClient.merchantPaymentDefaultLimits(MerchantType.WebPage)
      .subscribe((r: MerchantPaymentLimit) => {
        this.merchantPaymentLimit = r;
      }, error => {
        console.log(error)
      });

    this.companyClient.merchantRefundDefaultLimits(MerchantType.WebPage)
      .subscribe((r: MerchantRefundLimit) => {
        this.merchantRefundLimit = r;
      }, error => {
        console.log(error)
      });

    this.webPageClient.getDefaultPaymentMethods()
      .subscribe((r: PaymentMethod[]) => {
        this.payMethods = r;
      }, error => {
        const message = error.result.message ?? 'გადახდის მეთოდები ვერ ჩაიტვირთა';
        this.openSnackBar.openSnackBarDanger(message);
      })

    this.webPageClient.getDefaultCurrencies()
      .subscribe((r: PaymentCurrency[]) => {
        this.currencies = r;
      }, error => {
        const message = error.result.message ?? 'ვალუტები ვერ ჩაიტვირთა';
        this.openSnackBar.openSnackBarDanger(message);
      })
  }

  ngOnInit(): void {
    this.appService.setTitle('WebPages');
  }

  formSubmit() {
    this.formSubmitEvent.next(true);
  }

  formSubmitSub(): Observable<any> {
    return this.formSubmitEvent.asObservable();
  }

  registerWebPage(event: FormGroup) {
    this.webPageModel = this.merchantService.buildModel(event.value);

    this.webPageClient.addWebPageToCompany(this.companyModel.id, this.webPageModel)
      .subscribe((r: IdResponse) => {
        this.router.navigateByUrl(`webpages/${r.id}`)
          .then()
          .catch(e => throwError(e))
      }, error => {
        this.openSnackBar.openSnackBarDanger(error.result.message);
      });
  }
}
