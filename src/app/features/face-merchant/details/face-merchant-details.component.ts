import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import {
  CompanyClient,
  MccCode,
  FaceMerchantDetails,
  FaceMerchantClient, FaceTerminalClient, IdResponse
} from "../../../services/admin.api.client";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { OpenSnackbarService } from "../../../services/open-snackbar.service";
import { forkJoin } from "rxjs";
import { Title } from "@angular/platform-browser";
import { AppService } from "../../../services/app.service";
import { ConfirmActionComponent } from "../../../shared/components/confirm-action/confirm-action.component";
import { DialogAction, DialogService } from "@progress/kendo-angular-dialog";

@Component({
  selector: 'app-face-merchant-details',
  templateUrl: './face-merchant-details.component.html',
  styleUrls: ['./face-merchant-details.component.scss']
})
export class FaceMerchantDetailsComponent implements OnInit {
  formGroup: FormGroup;
  editMode = false;
  public merchantId: number;
  merchantDetails: FaceMerchantDetails;
  mccCodeValue: string;
  submitted = false;
  mccCodes: MccCode[];

  terminalNo: string;
  deviceId: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private faceMerchantClient: FaceMerchantClient,
    private companyClient: CompanyClient,
    private formBuilder: FormBuilder,
    private snackBar: OpenSnackbarService,
    private titleService: Title,
    private appService: AppService,
    private faceTerminalClient: FaceTerminalClient,
    private router: Router,
    private dialogService: DialogService
  ) {
    this.titleService.setTitle('Face მერჩანტი | დეტალები');
    this.appService.setTitle('Face მერჩანტი | დეტალები');

    this.activatedRoute.params.subscribe(p => {
      this.merchantId = p.id;
      this.appService.setUrl(`/facemerchant/${this.merchantId}/logs`)
    });
    this.formGroup = this.formBuilder.group({
      id: [this.merchantId],
      limitPerTransaction: ['', [Validators.required, Validators.pattern("[+-]?([0-9]*[.])?[0-9]+"), Validators.maxLength(16)]],
      limitPerDay: ['', [Validators.required, Validators.pattern("[+-]?([0-9]*[.])?[0-9]+"), Validators.maxLength(16)]],
      limitPerMonth: ['', [Validators.required, Validators.pattern("[+-]?([0-9]*[.])?[0-9]+"), Validators.maxLength(16)]],
      tradeName: ['', [Validators.required, Validators.maxLength(27)]],
      address: ['', [Validators.required, Validators.max(200)]],
      paymentMerchantExternalId: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      mccCodeId: ['', [Validators.required]],
      canRefund: [false],
      refundLimitPerDay: ['', [Validators.pattern("[+-]?([0-9]*[.])?[0-9]+"), Validators.maxLength(16)]],
      refundLimitPerMonth: ['', [Validators.pattern("[+-]?([0-9]*[.])?[0-9]+"), Validators.maxLength(16)]]
    });

    this.getMerchantDetails();
  }

  ngOnInit() {
  }

  private getMccCodeValue() {
    this.mccCodes.forEach((el: MccCode) => {
      if (el.id === this.merchantDetails.mccCodeId) {
        this.mccCodeValue = `${el.code} - ${el.descriptionKa}`
      }
    });
  }

  private setFormGroupValue() {
    this.formGroup.setValue({
      id: this.merchantId,
      limitPerTransaction: this.merchantDetails.limitPerTransaction,
      limitPerDay: this.merchantDetails.limitPerDay,
      limitPerMonth: this.merchantDetails.limitPerMonth,
      tradeName: this.merchantDetails.tradeName,
      address: this.merchantDetails.address,
      paymentMerchantExternalId: this.merchantDetails.paymentMerchantExternalId,
      mccCodeId: this.merchantDetails.mccCodeId,
      canRefund: this.merchantDetails.canRefund,
      refundLimitPerDay: this.merchantDetails.refundLimitPerDay ?? 0,
      refundLimitPerMonth: this.merchantDetails.refundLimitPerMonth ?? 0
    })
  }

  setEditMode() {
    this.editMode = !this.editMode;
    this.submitted = false;
    if (!this.editMode) {
      this.setFormGroupValue();
    }
  }

  updateMerchant() {
    this.submitted = true;
    if (!this.formGroup.valid) {
      return;
    }
    this.faceMerchantClient.saveFaceMerchant(this.formGroup.value)
      .subscribe(res => {
        this.getMerchantDetails();
        this.editMode = !this.editMode;
      }, error => {
        this.snackBar.openSnackBarDanger(error.result.message);
      })
  }

  updateMerchantStatus(id, status) {
    if (status === 2) {
      const dialogRef = this.dialogService.open({
        title: 'Face მერჩანტის გაუქმება',
        content: ConfirmActionComponent,
        width: 400
      });
      dialogRef.content.instance.message = '';
      dialogRef
        .result
        .subscribe((r: DialogAction) => {
          if (r.primary) {
            this.faceMerchantClient.changeFaceMerchantStatus(id, status)
              .subscribe(r => {
                this.getMerchantDetails();
              }, error => {
                this.snackBar.openSnackBarDanger(error.result.message);
              })
          }
        })
      return;
    }
    this.faceTerminalClient.queryFaceTerminal()
    this.faceMerchantClient.changeFaceMerchantStatus(id, status)
      .subscribe(r => {
        this.getMerchantDetails();
      }, error => {
        this.snackBar.openSnackBarDanger(error.result.message);
      })
  }

  addTerminalToMerchant() {
    if (!this.terminalNo) {
      this.snackBar.openSnackBarDanger('პლანშეტის ნომერი არ უნდა იყოს ცარიელი');
      return;
    }
    this.faceTerminalClient.addFaceTerminalRegister(this.merchantDetails.paymentMerchantExternalId, { terminalNo: this.terminalNo })
      .subscribe((r: IdResponse) => {
        this.terminalNo = '';
        this.getMerchantDetails();
      }, error => {
        this.snackBar.openSnackBarDanger(error.result.message);
      })
  }

  canRefundChange(event) {
    if (this.formGroup.get('canRefund').value) {
      this.formGroup.get('refundLimitPerDay').setValidators([Validators.required, Validators.pattern("[+-]?([0-9]*[.])?[0-9]+"), Validators.maxLength(16)]);
      this.formGroup.get('refundLimitPerDay').updateValueAndValidity();
      this.formGroup.get('refundLimitPerMonth').setValidators([Validators.required, Validators.pattern("[+-]?([0-9]*[.])?[0-9]+"), Validators.maxLength(16)]);
      this.formGroup.get('refundLimitPerMonth').updateValueAndValidity();
    } else {
      this.formGroup.get('refundLimitPerDay').setValidators([Validators.pattern("[+-]?([0-9]*[.])?[0-9]+"), Validators.maxLength(16)]);
      this.formGroup.get('refundLimitPerDay').updateValueAndValidity();
      this.formGroup.get('refundLimitPerMonth').setValidators([Validators.pattern("[+-]?([0-9]*[.])?[0-9]+"), Validators.maxLength(16)]);
      this.formGroup.get('refundLimitPerMonth').updateValueAndValidity();
    }
  }

  private getMerchantDetails() {
    forkJoin([this.faceMerchantClient.getFaceMerchant(this.merchantId), this.companyClient.mccCodes()]).subscribe(r => {
      this.merchantDetails = r[0];
      this.mccCodes = r[1];
      this.setFormGroupValue();
      this.getMccCodeValue();
    });
  }
}
