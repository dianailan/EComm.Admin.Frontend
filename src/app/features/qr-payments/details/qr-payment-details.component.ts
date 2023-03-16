import { Component } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { AppService } from "../../../services/app.service";
import { ActivatedRoute } from "@angular/router";
import {
    AddCashDesk, AddCashDeskWithDevice,
    AddCashDeskWithExistingQr,
    AddDeviceToCashDesk,
    AddCashierToCashDesk,
    CompanyClient,
    MccCode, QRCodeClient,
    QRPaymentClient,
    QRPaymentDetails
} from "../../../services/admin.api.client";
import { forkJoin } from "rxjs";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { OpenSnackbarService } from "../../../services/open-snackbar.service";
import { DialogAction, DialogService } from "@progress/kendo-angular-dialog";
import { addCashierToCashdeskComponent } from "./popup-components/add-cashier-to-cashdesk/add-cashier-to-cashdesk.component";
import { AddDeviceComponent } from "./popup-components/add-device/add-device.component";
import { AddCashdeskComponent } from "./popup-components/add-cashdesk/add-cashdesk.component";
import { AddCashdeskWithDeviceComponent } from "./popup-components/add-cashdesk-with-device/add-cashdesk-with-device.component";
import { AddCashdeskWithExistingQrComponent } from "./popup-components/add-cashdesk-with-existing-qr/add-cashdesk-with-existing-qr.component";
import { PrintQrComponent } from "./popup-components/print-qr/print-qr.component";
import { DownloadService } from "../../../services/download.service";
import { ConfirmActionComponent } from "../../../shared/components/confirm-action/confirm-action.component";

@Component({
    selector: 'app-qr-payment-details',
    templateUrl: './qr-payment-details.component.html',
    styleUrls: ['./qr-payment-details.component.scss']
})

export class QrPaymentDetailsComponent {
    private qrPaymentId: number;
    mccCodes: MccCode[];
    mccCodeValue: string;
    qrPaymentDetails: QRPaymentDetails;
    formGroup: FormGroup;
    editMode = false;
    submitted = false;

    constructor(
        private titleService: Title,
        private appService: AppService,
        private activatedRoute: ActivatedRoute,
        private qrPaymentClient: QRPaymentClient,
        private companyClient: CompanyClient,
        private formBuilder: FormBuilder,
        private snackBar: OpenSnackbarService,
        private dialogService: DialogService,
        private qrCodeClient: QRCodeClient,
        private download: DownloadService) {
        this.titleService.setTitle('QR ობიექტი | დეტალები');
        this.appService.setTitle('QR ობიექტი | დეტალები');

        this.activatedRoute.params.subscribe(p => {
            this.qrPaymentId = p.id;
            this.appService.setUrl(`/qrpayments/${this.qrPaymentId}/logs`)
        });
        this.formGroup = this.formBuilder.group({
            id: [null],
            limitPerTransaction: ['', [Validators.required, Validators.pattern("[+-]?([0-9]*[.])?[0-9]+"), Validators.maxLength(16)]],
            limitPerDay: ['', [Validators.required, Validators.pattern("[+-]?([0-9]*[.])?[0-9]+"), Validators.maxLength(16)]],
            limitPerMonth: ['', [Validators.required, Validators.pattern("[+-]?([0-9]*[.])?[0-9]+"), Validators.maxLength(16)]],
            refundLimitPerDay: ['', [Validators.pattern("[+-]?([0-9]*[.])?[0-9]+"), Validators.maxLength(16)]],
            refundLimitPerMonth: ['', [Validators.pattern("[+-]?([0-9]*[.])?[0-9]+"), Validators.maxLength(16)]],
            tradeNameEn: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9,.\s]+$/)]],
            tradeNameKa: ['', [Validators.required, Validators.pattern(/^[ა-ჰ0-9,.\s]+$/)]],
            paymentMerchantExternalId: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
            accountNumber: ['', [Validators.required, Validators.maxLength(22), Validators.minLength(22)]],
            qrPaymentType: ['', [Validators.required]],
            mccCodeId: ['', [Validators.required]],
            canRefund: [false]
        });

        this.getQrPaymentDetails();
    }

    private getQrPaymentDetails() {
        forkJoin([this.qrPaymentClient.getQRPayment(this.qrPaymentId), this.companyClient.mccCodes()]).subscribe(r => {
            this.qrPaymentDetails = r[0];
            this.mccCodes = r[1];
            this.setFormGroupValue();
            this.getMccCodeValue();

            if (this.formGroup.get('canRefund').value) {
                this.formGroup.get('refundLimitPerDay').setValidators([Validators.required, Validators.pattern("[+-]?([0-9]*[.])?[0-9]+"), Validators.maxLength(16)]);
                this.formGroup.get('refundLimitPerMonth').setValidators([Validators.required, Validators.pattern("[+-]?([0-9]*[.])?[0-9]+"), Validators.maxLength(16)]);
            }
        });
    }

    setFormGroupValue() {
        this.formGroup.setValue({
            id: this.qrPaymentId,
            limitPerTransaction: this.qrPaymentDetails.paymentLimits.transaction,
            limitPerDay: this.qrPaymentDetails.paymentLimits.daily,
            limitPerMonth: this.qrPaymentDetails.paymentLimits.monthly,
            tradeNameEn: this.qrPaymentDetails.tradeNameEn,
            tradeNameKa: this.qrPaymentDetails.tradeNameKa,
            paymentMerchantExternalId: this.qrPaymentDetails.paymentMerchantExternalId,
            accountNumber: this.qrPaymentDetails.accountNumber,
            qrPaymentType: this.qrPaymentDetails.paymentType,
            mccCodeId: this.qrPaymentDetails.mccCodeId,
            canRefund: this.qrPaymentDetails.canRefund,
            refundLimitPerDay: this.qrPaymentDetails.refundLimit.daily,
            refundLimitPerMonth: this.qrPaymentDetails.refundLimit.monthly
        })
    }

    updateMerchant() {
        this.submitted = true;
        if (!this.formGroup.valid) {
            return;
        }
        this.qrPaymentClient.saveQRPayment(this.formGroup.value)
            .subscribe(res => {
                this.getQrPaymentDetails();
                this.editMode = !this.editMode;
            }, error => {
                this.snackBar.openSnackBarDanger(error.result.message);
            })
    }

    setEditMode() {
        this.editMode = !this.editMode;
        this.submitted = false;
        if (!this.editMode) {
            this.setFormGroupValue();
        }
    }

    updateQrPaymentStatus(status) {
        if (status === 2) {
            const dialogRef = this.dialogService.open({
                title: 'QR ობიექტის გაუქმება',
                content: ConfirmActionComponent,
                width: 400
            });
            dialogRef.content.instance.message = '';
            dialogRef
                .result
                .subscribe((r: DialogAction) => {
                    if (r.primary) {
                        this.qrPaymentClient.changeQRPaymentStatus(this.qrPaymentId, status)
                            .subscribe(r => {
                                this.getQrPaymentDetails();
                            }, error => {
                                this.snackBar.openSnackBarDanger(error.result.message);
                            })
                    }
                })
            return;
        }
        this.qrPaymentClient.changeQRPaymentStatus(this.qrPaymentId, status)
            .subscribe(r => {
                this.getQrPaymentDetails();
            }, error => {
                this.snackBar.openSnackBarDanger(error.result.message);
            })
    }

    deleteCashDesk(cashDeskId) {
        this.qrPaymentClient.deleteCashDesk(cashDeskId)
            .subscribe(r => {
                this.getQrPaymentDetails();
            }, error => {
                this.snackBar.openSnackBarDanger(error.result.message);
                throw error;
            })
    }

    addCashierToCashDesk(cashDeskId) {
        const dialogRef = this.dialogService.open({
            title: 'მოლარის დამატება',
            content: addCashierToCashdeskComponent
        });
        dialogRef.result.subscribe((r: { primary: boolean, cashierInfo: AddCashierToCashDesk }) => {
            if (r.primary) {
                this.qrPaymentClient.addCashierToCashDesk(cashDeskId, r.cashierInfo)
                    .subscribe(r => {
                        this.getQrPaymentDetails();
                    }, error => {
                        this.snackBar.openSnackBarDanger(error.result.message);

                        throw error;
                    })
            }
        });
    }

    addDeviceToCashDesk(cashDeskId) {
        const dialogRef = this.dialogService.open({
            title: 'დივაისის დამატება',
            content: AddDeviceComponent,
            width: 400
        });

        dialogRef.result.subscribe((r: { primary: boolean, deviceInfo: AddDeviceToCashDesk }) => {
            if (r.primary) {
                this.qrPaymentClient.addDeviceToCashDesk(cashDeskId, r.deviceInfo)
                    .subscribe(r => {
                        this.getQrPaymentDetails();
                    }, error => {
                        this.snackBar.openSnackBarDanger(error.result.message);

                        throw error;
                    })
            }
        })
    }

    addCashDesk() {
        const dialogRef = this.dialogService.open({
            title: 'სალაროს დამატება',
            content: AddCashdeskComponent,
            width: 350
        });
        dialogRef.result.subscribe((r: { primary: boolean, cashDesk: AddCashDesk }) => {
            if (r.primary) {
                this.qrPaymentClient.addCashDesk(this.qrPaymentId, r.cashDesk)
                    .subscribe(r => {
                        this.getQrPaymentDetails();
                    }, error => {
                        this.snackBar.openSnackBarDanger(error.result.message);

                        throw error;
                    })
            }
        }, error => {
            throw error;
        })
    }

    addCashDeskWithDevice() {
        const dialogRef = this.dialogService.open({
            title: 'სალაროს დამატება',
            content: AddCashdeskWithDeviceComponent,
            width: 350
        });

        dialogRef.result.subscribe((r: { primary: boolean, cashDesk: AddCashDeskWithDevice }) => {
            if (r.primary) {
                this.qrPaymentClient.addCashDeskWithDevice(this.qrPaymentId, r.cashDesk)
                    .subscribe(r => {
                        this.getQrPaymentDetails();
                    }, error => {
                        this.snackBar.openSnackBarDanger(error.result.message);
                    })
            }
        })
    }

    addCashDeskWithExistingQR() {
        const dialogRef = this.dialogService.open({
            title: 'სალაროს დამატება',
            content: AddCashdeskWithExistingQrComponent,
            width: 350
        });

        const instance = dialogRef.content.instance;

        dialogRef.result.subscribe((r: { primary: boolean, cashDesk: AddCashDeskWithExistingQr }) => {
            if (r.primary) {
                this.qrPaymentClient.addCashDeskWithExistingQr(this.qrPaymentId, r.cashDesk)
                    .subscribe(r => {
                        this.getQrPaymentDetails();
                    }, error => {
                        this.snackBar.openSnackBarDanger(error.result.message);
                    })
            }
        })
    }

    updateCashDeskName(object: { cashDeskName: string, cashDeskId: number }) {
        this.qrPaymentClient.editCashDeskName(object.cashDeskId, object.cashDeskName)
            .subscribe(r => {
                this.getQrPaymentDetails();
            }, error => {
                this.snackBar.openSnackBarDanger(error.result.message);
                throw error;
            })
    }

    deleteCashier(object: { cashDeskCashierId: number }) {
        this.qrPaymentClient.deleteCashierFromCashDesk(object.cashDeskCashierId)
            .subscribe(r => {
                this.getQrPaymentDetails();
            }, error => {
                this.snackBar.openSnackBarDanger(error.result.message);
                throw error;
            });
    }

    deleteDevice(object: { cashDeskDeviceId: number }) {
        const { cashDeskDeviceId } = object;
        this.qrPaymentClient.deleteDeviceFromCashDesk(cashDeskDeviceId)
            .subscribe(r => {
                this.getQrPaymentDetails();
            }, error => {
                this.snackBar.openSnackBarDanger(error.result.message);
                throw error;
            })
    }

    generateQr(cashDeskId) {
        this.qrPaymentClient.generateQrCodeForCashDesk(cashDeskId)
            .subscribe(r => {
                this.getQrPaymentDetails();
            }, error => {
                this.snackBar.openSnackBarDanger(error.result.message);
                throw error;
            })
    }

    printQr(qrCode) {
        const permissions: string[] = JSON.parse(localStorage.getItem('user_permissions'));

        if (!(permissions?.includes('R_QRM_GenerateQR')))
            return;

        const dialogRef = this.dialogService.open({
            title: 'QR-ის ჩამოტვირთვა',
            content: PrintQrComponent,
            width: 350
        });

        dialogRef.result.subscribe((r: { primary: boolean, qrType: number }) => {
            if (r.primary) {
                this.downloadQr(qrCode, r.qrType);
            }
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

    private async downloadQr(qrCode, qrType) {
        try {
            const res = await this.qrCodeClient.print(qrCode, qrType).toPromise();
            this.download.download(res);
        } catch (e) {
            throw e;
        }
    }

    private getMccCodeValue() {
        this.mccCodes.forEach((el: MccCode) => {
            if (el.id === this.qrPaymentDetails.mccCodeId) {
                this.mccCodeValue = `${el.code} - ${el.descriptionKa}`
            }
        })
    }
}
