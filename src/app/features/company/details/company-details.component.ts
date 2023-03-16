import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  CompanyClient,
  CompanyDetailsResponseModel, FaceMerchantClient,
  QRMerchantsClient,
  QRPaymentClient,
  PosQRClient,
  ServiceStatus, UserClient, UserCompanyDetails,
  UserRole,
  WebPageClient,
} from "../../../services/admin.api.client";
import { Title } from "@angular/platform-browser";
import { AppService } from "../../../services/app.service";
import { DialogAction, DialogService } from "@progress/kendo-angular-dialog";
// import {AddUserToCompanyComponent} from "./popup-components/add-user-to-company/add-user-to-company.component";
import { OpenSnackbarService } from "../../../services/open-snackbar.service";
import { ChangeUserRoleComponent } from "./popup-components/change-user-role/change-user-role.component";
import { ConfirmActionComponent } from "../../../shared/components/confirm-action/confirm-action.component";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AddUserService } from "../services/add-user.service";
import { Subscription } from "rxjs";
import { ConfirmUserRoleComponent } from "./popup-components/confirm-user-role/confirm-user-role.component";

export interface IQueryParams {
  juridicalName: string,
  identificationNumber: string,
  id: number
}

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.scss']
})

export class CompanyDetailsComponent implements OnInit {
  companyResponse: CompanyDetailsResponseModel;

  queryParams: IQueryParams;

  editMode = false;
  submitted = false;

  companyId: number;
  formGroup: FormGroup;

  constructor(
    private activatedRoute: ActivatedRoute,
    private companyClient: CompanyClient,
    private titleService: Title,
    private appService: AppService,
    private router: Router,
    private webPageClient: WebPageClient,
    private qrPaymentClient: QRPaymentClient,
    private qrMerchantsClient: QRMerchantsClient,
    private posQrClient: PosQRClient,
    private faceMerchantClient: FaceMerchantClient,
    private dialog: DialogService,
    private snackBar: OpenSnackbarService,
    private formBuilder: FormBuilder,
    private dialogService: DialogService,
    private addUserService: AddUserService,
    private userClient: UserClient) {
    this.titleService.setTitle('კომპანია | დეტალები');

    this.activatedRoute.paramMap
      .subscribe(params => {
        this.companyId = +params.get('id');
        this.appService.setUrl(`/companies/${this.companyId}/logs`)
        this.getCompanyDetails();
      })

    this.formGroup = this.formBuilder.group({
      id: [this.companyId],
      name: ['', [Validators.required, Validators.maxLength(256)]],
      email: ['', [Validators.required, Validators.maxLength(50)]],
      identificationNumber: ['', [Validators.required]],
      clientNo: [''],
    });
  }

  ngOnInit(): void {
    this.appService.setTitle('კომპანია | დეტალები');
  }

  updateCompanyStatus(status: number): void {
    if (status === 2) {
      const dialogRef = this.dialogService.open({
        title: 'კომპანიის გაუქმება',
        content: ConfirmActionComponent,
        width: 400
      });
      dialogRef.content.instance.message = '';
      dialogRef
        .result
        .subscribe((r: DialogAction) => {
          if (r.primary) {
            this.companyClient.changeStatus(this.companyResponse.details.id, status)
              .subscribe(() => {
                this.getCompanyDetails();
              }, error => {
                this.snackBar.openSnackBarDanger(error.result.message);
              })
          }
        })
      return;
    }
    this.companyClient.changeStatus(this.companyResponse.details.id, status)
      .subscribe(r => {
        this.getCompanyDetails();
      }, error => {
        this.snackBar.openSnackBarDanger(error.result.message);
      })
  }

  addWebPageToCompany(): void {
    this.router.navigate([`/webpages/registerWebPage`], { queryParams: this.queryParams })
      .then()
      .catch(e => {
        throw e;
      })
  }

  addPosQrMerchantToCompany(): void {
    this.router.navigate([`/posqr/registerPosQr`], { queryParams: this.queryParams })
      .then()
      .catch(e => {
        throw e;
      })
  }

  addQrPaymentToCompany(): void {
    this.router.navigate(['/qrpayments/registerQrPayment'], { queryParams: this.queryParams })
      .then()
      .catch(e => {
        throw e;
      })
  }

  addMerchantToCompany(): void {
    this.router.navigate([`/qrmerchant/registerQrMerchant`], { queryParams: this.queryParams })
      .then()
      .catch(e => {
        throw e;
      })
  }

  addFaceMerchantToCompany(): void {
    this.router.navigate([`/facemerchant/registerFaceMerchant`], { queryParams: this.queryParams })
      .then()
      .catch(e => {
        throw e;
      })
  }

  addUserToCompany() {
    this.router.navigate([`companies/${this.companyId}/add-user`])
      .catch(e => console.log(e))
    // let userServiceSubscription: Subscription;
    // this.dialog.open({
    //   title: 'მომხმარებლის დამატება',
    //   content: AddUserToCompanyComponent,
    // }).result.subscribe((r: { primary: boolean}) => {
    //   if(!r.primary) {
    //     userServiceSubscription.unsubscribe();
    //   }
    // this.companyClient.addUserToCompany(this.companyId.toString(), {})
    //   .subscribe(r => {
    //     this.getCompanyDetails();
    //   }, error => {
    //     this.snackBar.openSnackBarDanger(error.result.message);
    //   })
    // })

    // userServiceSubscription = this.addUserService.clientNumberSub()
    //   .subscribe((r: string) => {
    //     this.userClient.getUserInfo(r)
    //       .subscribe((r) => {
    //         this.addUserService.userInfo(r);
    //       })
    //   })
  }

  changeUserRole(userId) {
    this.companyClient.getUserCompanyDetails(this.companyId, userId)
      .subscribe((r) => {
        this.openRoleChangeDialog(r, userId)
      }, error => {
        console.log(error)
      })
  }

  openRoleChangeDialog(data: UserCompanyDetails, userId) {
    let dialogRef = this.dialog.open({
      title: 'როლის შეცვლა',
      content: ChangeUserRoleComponent,
      width: 300,
      maxHeight: 500
    })
    dialogRef.content.instance.userCompanyDetails = data
    dialogRef
      .result
      .subscribe((r: { primary: boolean, role: UserRole, paymentMerchantIds: number[] }) => {
        if (r.primary) {
          this.companyClient.changeUserRoleAndPaymentMerchants(this.companyId, {
            paymentMerchantIds: r.paymentMerchantIds,
            role: r.role,
            userId: userId
          })
            .subscribe(r => {
              this.getCompanyDetails();
            }, error => {
              this.snackBar.openSnackBarDanger(error.result.message);
            })
        }
      })
  }

  openRoleConfirmDialog(data: UserCompanyDetails, event) {
    let dialogRef = this.dialog.open({
      title: 'დადასტურება/უარყოფა',
      content: ConfirmUserRoleComponent,
      width: 300,
      maxHeight: 500
    })
    dialogRef.content.instance.userRole = event.requestedRole
    dialogRef.content.instance.webpages = data
    dialogRef
      .result
      .subscribe((r: { primary: boolean, confirmed: boolean }) => {
        if (r.primary === true) {
          this.companyClient.confirmUserRoleChange(this.companyId, event.userId, r.confirmed)
            .subscribe(r => {
              this.getCompanyDetails();
            }, error => {
              this.snackBar.openSnackBarDanger(error.result.message);
            })
        }
      })
  }

  confirmUserRole(event: { userId: number, requestedMerchantIds, requestedRole }) {
    this.companyClient.getUserCompanyDetails(this.companyId, event.userId)
      .subscribe((r) => {
        this.openRoleConfirmDialog(r, event)
      });
  }

  changeWebPageStatus(event: { status: ServiceStatus, id: number }): void {
    this.webPageClient.changeWebPageStatus(event.id, event.status)
      .subscribe(r => {
        this.getCompanyDetails();
      }, error => {
        this.snackBar.openSnackBarDanger(error.result.message);
      })
  }

  changePosQrMerchantStatus(event: { status: ServiceStatus, id: number }): void {
    this.posQrClient.changePosQRMerchantStatus(event.id, event.status)
      .subscribe(r => {
        this.getCompanyDetails();
      }, error => {
        this.snackBar.openSnackBarDanger(error.result.message);
      })
  }

  changeQRPaymentStatus(event: { status: ServiceStatus, id: number }): void {
    this.qrPaymentClient.changeQRPaymentStatus(event.id, event.status)
      .subscribe(r => {
        this.getCompanyDetails();
      }, error => {
        this.snackBar.openSnackBarDanger(error.result.message);
      })
  }

  changeQRMerchantStatus(event: { status: ServiceStatus, id: number }): void {
    this.qrMerchantsClient.changeQrMerchantStatus(event.id, event.status)
      .subscribe(r => {
        this.getCompanyDetails();
      }, error => {
        this.snackBar.openSnackBarDanger(error.result.message);
      })
  }

  changeFaceMerchantStatus(event: { status: ServiceStatus, id: number }) {
    this.faceMerchantClient.changeFaceMerchantStatus(event.id, event.status)
      .subscribe(r => {
        this.getCompanyDetails();
      }, error => {
        this.snackBar.openSnackBarDanger(error.result.message);
      })
  }

  cancelUser(userId: number): void {
    this.companyClient.deleteUserFromCompany(this.companyId, userId)
      .subscribe(() => {
        this.getCompanyDetails();
      }, error => {
        this.snackBar.openSnackBarDanger(error.result.message)
      });
  }

  setEditMode() {
    this.editMode = !this.editMode;
    this.submitted = false;
    if (!this.editMode) {
      this.setFormGroupValue();
    }
  }

  updateCompany() {
    this.submitted = true;
    if (!this.formGroup.valid) {
      return;
    }

    this.companyClient.saveCompany(this.formGroup.value)
      .subscribe(res => {
        this.getCompanyDetails();
        this.editMode = !this.editMode;
      }, error => {
        this.snackBar.openSnackBarDanger(error.result.message);
      })
  }

  private setFormGroupValue() {
    try {
      this.formGroup.setValue({
        id: this.companyId,
        name: this.companyResponse.details.name,
        email: this.companyResponse.details.companyEmail,
        identificationNumber: this.companyResponse.details.identificationNumber,
        clientNo: this.companyResponse.details.clientNo
      });
    } catch (e) {
      console.log(e)
    }
  }

  private getCompanyDetails(): void {
    this.companyClient.getCompany(this.companyId)
      .subscribe((r: CompanyDetailsResponseModel) => {
        this.companyResponse = r;
        this.createQueryParams();
        this.setFormGroupValue();
      }, error => {
        this.snackBar.openSnackBarDanger(error.result.message);
      })
  }

  private createQueryParams(): void {
    this.queryParams = {
      juridicalName: this.companyResponse.details.name,
      identificationNumber: this.companyResponse.details.identificationNumber,
      id: this.companyResponse.details.id
    };
  }
}
