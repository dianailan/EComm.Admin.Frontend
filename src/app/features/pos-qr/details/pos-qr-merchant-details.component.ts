import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  CompanyClient,
  MccCode,
  PosQRClient,
  PosQRDetails,
  ServiceStatus,
  PosQRTerminalClient,
  PosQRTerminalStatus
} from "../../../services/admin.api.client";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { OpenSnackbarService } from "../../../services/open-snackbar.service";
import { forkJoin } from "rxjs";
import { Router } from "@angular/router";
import { AppService } from "../../../services/app.service";
import { Title } from "@angular/platform-browser";
import { ConfirmActionComponent } from "../../../shared/components/confirm-action/confirm-action.component";
import { DialogAction, DialogService } from "@progress/kendo-angular-dialog";
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-pos-qr-merchant-details',
  templateUrl: './pos-qr-merchant-details.component.html',
  styleUrls: ['./pos-qr-merchant-details.component.scss']
})
export class PosQrMerchantDetailsComponent implements OnInit {
  formGroup: FormGroup;
  posQrDetails: PosQRDetails;
  editMode = false;
  public posQrId: number;
  merchantExternalId: string;
  mccCodeValue: string;
  submitted = false;
  mccCodes: MccCode[];
  public opened = false;
  clientId: string = '';
  clientSecret: string = '';
  queryParams;

  constructor(
    private activatedRoute: ActivatedRoute,
    private companyClient: CompanyClient,
    private posQrClient: PosQRClient,
    private formBuilder: FormBuilder,
    private snackBar: OpenSnackbarService,
    private router: Router,
    private appService: AppService,
    private titleService: Title,
    private dialogService: DialogService,
    private clipboard: Clipboard,
    private posQrTerminalClient: PosQRTerminalClient
  ) {
    this.titleService.setTitle('POS QR | დეტალები');

    this.activatedRoute.params.subscribe(p => {
      this.posQrId = p.id;
      this.appService.setUrl(`/posqr/${this.posQrId}/logs`)
    });

    this.formGroup = this.formBuilder.group({
      id: [this.posQrId],
      tradeName: ['', [Validators.required, Validators.maxLength(27)]],
      merchantExternalId: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      mccCodeId: ['', [Validators.required]],
      status: [''],
    });

    this.getPosQrDetails();
  }

  public close(): void {
    this.opened = false;
  }

  public open(): void {
    this.opened = true;

    this.posQrClient.clientSecret(this.posQrId).subscribe(res => {
      this.clientId = res.clientId;
      this.clientSecret = res.clientSecret;
    });
  }

  copySecret() {
    this.clipboard.copy(this.clientSecret);
    this.snackBar.openSnackBarSuccess('Client Secret დაკოპირებულია');
  }

  copyId() {
    this.clipboard.copy(this.clientId);
    this.snackBar.openSnackBarSuccess('Client ID დაკოპირებულია');
  }

  ngOnInit(): void {
    this.appService.setTitle('POS QR | დეტალები');
  }

  sendMerchantIdToRegisterTerminal() {
  }

  setEditMode() {
    this.editMode = !this.editMode;
    this.submitted = false;
    if (!this.editMode) {
      this.setFormGroupValue();
    }
  }

  private setFormGroupValue() {
    try {
      this.formGroup.setValue({
        id: this.posQrId,
        tradeName: this.posQrDetails.tradeName,
        merchantExternalId: this.posQrDetails.merchantExternalId,
        mccCodeId: this.posQrDetails.mccCodeId,
        status: this.posQrDetails.statusName,
      });

      if (this.formGroup.controls['merchantExternalId'].value) {
        this.merchantExternalId = this.formGroup.controls['merchantExternalId'].value;
      }
    } catch (e) {
      console.log(e)
    }
  }

  private getMccCodeValue() {
    try {
      this.mccCodes.forEach((el: MccCode) => {
        if (el.id === this.posQrDetails.mccCodeId) {
          this.mccCodeValue = `${el.code} ${el.descriptionKa}`
        }
      })
    } catch (e) {
      console.log(e)
    }
  }

  updatePosQr() {
    this.submitted = true;
    if (!this.formGroup.valid) {
      return;
    }
    this.posQrClient.updatePosQRMerchant(this.formGroup.value)
      .subscribe(res => {
        this.getPosQrDetails();
        this.editMode = !this.editMode;
      }, error => {
        this.snackBar.openSnackBarDanger(error.result.message);
      })
  }

  private getPosQrDetails() {
    forkJoin([
      this.posQrClient.getPosQRMerchant(this.posQrId),
      this.companyClient.mccCodes()])
      .subscribe(r => {
        this.posQrDetails = r[0];
        this.mccCodes = r[1];
        this.createQueryParams();
        this.setFormGroupValue();
        this.getMccCodeValue();
      });
  }

  registerTerminal(): void {
    this.router.navigate([`/posterminal/registerPosTerminal`], { queryParams: this.queryParams })
      .then()
      .catch(e => {
        throw e;
      })
  }

  private createQueryParams(): void {
    this.queryParams = {
      merchantId: this.posQrDetails.merchantExternalId
    };
  }

  changeTerminalStatus(id: number, status: PosQRTerminalStatus): void {
    this.posQrTerminalClient.changePosQRTerminalStatus(id, status)
      .subscribe(r => {
        this.getPosQrDetails();
      }, error => {
        this.snackBar.openSnackBarDanger(error.result.message);
      })
  }
  updatePosQrStatus(id, status) {
    if (status === 2) {
      const dialogRef = this.dialogService.open({
        title: 'BNPL მერჩანტის გაუქმება',
        content: ConfirmActionComponent,
        width: 400
      });
      dialogRef.content.instance.message = '';
      dialogRef
        .result
        .subscribe((r: DialogAction) => {
          if (r.primary) {
            this.posQrClient.changePosQRMerchantStatus(id, status)
              .subscribe(r => {
                this.getPosQrDetails();
              }, error => {
                this.snackBar.openSnackBarDanger(error.result.message);
              })
          }
        })
      return;
    }
    this.posQrClient.changePosQRMerchantStatus(id, status)
      .subscribe(r => {
        this.getPosQrDetails();
      }, error => {
        this.snackBar.openSnackBarDanger(error.result.message);
      })
  }
}
