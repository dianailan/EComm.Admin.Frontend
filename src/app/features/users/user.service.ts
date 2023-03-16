import { Injectable } from "@angular/core";
import {
  RegisterUserType,
  SubmitUserRegistration,
  UserClient,
  UserReferenceModel, UserRegistrationResponseModel
} from "../../services/admin.api.client";
import { DialogAction, DialogService } from "@progress/kendo-angular-dialog";
import { UserDeleteConfirmComponent } from "../../shared/components/user-delete-confirm/user-delete-confirm.component";
import { Subject } from "rxjs";
import { UserRegistrationPreviewComponent } from "./user-registration-preview/user-registration-preview.component";
import { OpenSnackbarService } from "../../services/open-snackbar.service";
import { ConfirmActionComponent } from "../../shared/components/confirm-action/confirm-action.component";

export interface IUserRegister {
  clientNoOrPersonalId: string,
  registerUserType: RegisterUserType
}

export interface IUserRegisteredResponse {
  response: boolean,
  success?: boolean,
  message: string
}

@Injectable({
  providedIn: "root"
})

export class UserService {
  userDeletedSubject: Subject<null> = new Subject<null>();
  userInfoFromTibco: Subject<SubmitUserRegistration | IUserRegisteredResponse> = new Subject<SubmitUserRegistration | IUserRegisteredResponse>();
  submitUserRegistration: Subject<boolean> = new Subject<boolean>();
  confirmActionResultSubject: Subject<boolean> = new Subject<boolean>();

  constructor(
    private userClient: UserClient,
    private dialogService: DialogService,
    public openSnackBar: OpenSnackbarService
  ) {
  }

  userDeleteSub() {
    return this.userDeletedSubject.asObservable();
  }

  userInfoFromTibcoSub() {
    return this.userInfoFromTibco.asObservable();
  }

  submitUserRegistrationSub() {
    return this.submitUserRegistration.asObservable();
  }

  confirmActionResultSub() {
    return this.confirmActionResultSubject.asObservable()
  }

  deleteUserConfirm(userId) {
    this.dialogService.open({
      title: 'მომხმარებლის წაშლა',
      content: 'ნამდვილად გსურთ მომხმარებლის გაუქმება?',
      width: 400,
      actions: [
        { text: "არა" },
        { text: "კი", primary: true }
      ]
    })
      .result
      .subscribe((r: DialogAction) => {
        if (r.primary) {
          this.getUserRef(userId)
        }
      }, error => {
        console.error(error)
      })
  }

  public registerUser(formValue: IUserRegister) {
    this.userClient.registerUserFirstPhase(formValue.clientNoOrPersonalId, formValue.registerUserType)
      .subscribe(response => {
        if (response.message) {
          const confirmAction = this.dialogService.open({
            content: ConfirmActionComponent,
            width: 400
          });

          confirmAction.content.instance.message = response.message;

          confirmAction.result.subscribe((r: DialogAction) => {
            if (r.primary) {
              this.previewUserRegistration(response);
            } else {
              this.confirmActionResultSubject.next(false);
            }
          })
        } else {
          this.previewUserRegistration(response);
        }
      }, error => {
        const userRegistered: IUserRegisteredResponse = { response: false, message: '' };
        if (error?.result?.hasOwnProperty('validationErrors')) {
          userRegistered.message = error?.result?.validationErrors['PhoneNumber']
        }
        userRegistered.response = true;
        userRegistered.message = error?.result?.message;
        this.userInfoFromTibco.next(userRegistered);
      });
  }

  private getUserRef(userId) {
    this.userClient.getUserReferences(userId)
      .subscribe((r: UserReferenceModel[]) => {
        if (r.length === 0) {
          this.deleteUser(userId);
        } else if (r.length > 0) {
          const dialogRef = this.dialogService.open({
            title: 'ნამდვილად გსურთ მომხმარებლის გაუქმება?',
            content: UserDeleteConfirmComponent,
            width: 720,
            height: 400
          });

          dialogRef.content.instance.setCompanyList = r;
          dialogRef.result.subscribe((r: DialogAction) => {
            if (r.primary) {
              this.deleteUser(userId);
            }
          });
        }
      })
  }

  private deleteUser(userId) {
    this.userClient.deleteUser(userId)
      .subscribe((r) => {
        this.userDeletedSubject.next()
      }, error => {
        console.error(error);
      })
  }

  private previewUserRegistration(response: UserRegistrationResponseModel) {
    this.userInfoFromTibco.next(response.user);
    const dialogRef = this.dialogService.open({
      title: 'დადასტურება',
      content: UserRegistrationPreviewComponent,
      width: 400
    });
    dialogRef.content.instance.setUserData(response.user);
    dialogRef.result
      .subscribe((r: DialogAction) => {
        if (r.primary) {
          this.userClient.submitUserRegistration(response.user)
            .subscribe(() => {
              this.submitUserRegistration.next(true);
              this.openSnackBar.openSnackBarSuccess('მომხმარებელი წარმატებით დარეგისტრირდა');
            }, error => {
              this.submitUserRegistration.next(false);
              this.openSnackBar.openSnackBarDanger(error.result.message);
            })
        } else {
          this.submitUserRegistration.next(false);
        }
      })
  }
}
