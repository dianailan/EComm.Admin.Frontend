import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { AppService } from "src/app/services/app.service";
import {
  CompanyClient,
  MccCode,
  IdResponse,
  MerchantPaymentLimit,
  MerchantType,
  PosQRClient,
  RegisterPosQRMerchantRequest,
  MerchantRefundLimit
} from "src/app/services/admin.api.client";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, Subject, throwError } from "rxjs";
import { FormGroup } from "@angular/forms";
import { OpenSnackbarService } from "src/app/services/open-snackbar.service";
import { MerchantService } from "src/app/services/merchant.service";
import { DialogAction, DialogService } from "@progress/kendo-angular-dialog";
import { ConfirmActionComponent } from "src/app/shared/components/confirm-action/confirm-action.component";

@Component({
  selector: 'app-register-pos-qr-merchant',
  templateUrl: './register-pos-qr-merchant.component.html',
  styleUrls: ['./register-pos-qr-merchant.component.scss']
})
export class RegisterPosQrMerchantComponent implements OnInit {
  mccCodes: MccCode[];

  public formSubmitEvent: Subject<boolean> = new Subject<boolean>();
  private posQrMerchantModel: RegisterPosQRMerchantRequest;

  companyModel = {
    juridicalName: '',
    identificationNumber: '',
    id: 0
  };

  constructor(
    private companyClient: CompanyClient,
    private posQrClient: PosQRClient,
    private activatedRoute: ActivatedRoute,
    private appService: AppService,
    private titleService: Title,
    private openSnackBar: OpenSnackbarService,
    private router: Router,
    private merchantService: MerchantService,
    private dialogService: DialogService,) {
    this.appService.setTitle('POS QR | რეგისტრაცია');

    this.companyModel.id = parseInt(this.activatedRoute.snapshot.queryParams.id, 0);

    this.companyClient.mccCodes()
      .subscribe((r: MccCode[]) => {
        this.mccCodes = r;
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

  ngOnInit(): void {
    this.titleService.setTitle('POS QR');
  }

  registerPosQrMerchant(event: FormGroup) {
    this.posQrMerchantModel = this.merchantService.buildModel(event.value);

    this.posQrClient.addPosQRMerchantToCompany(this.companyModel.id, this.posQrMerchantModel)
      .subscribe((r: IdResponse) => {
        this.router.navigateByUrl(`posqr/${r.id}`)
          .then()
          .catch(e => throwError(e))
      }, error => {
        this.openSnackBar.openSnackBarDanger(error.result.message);
      });
  }
}
