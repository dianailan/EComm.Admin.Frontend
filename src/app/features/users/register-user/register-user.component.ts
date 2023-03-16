import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogContentBase, DialogRef, DialogService } from '@progress/kendo-angular-dialog';
import { UserClient } from "../../../services/admin.api.client";
import { OpenSnackbarService } from "../../../services/open-snackbar.service";
import { UserService } from "../user.service";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss']
})
export class RegisterUserComponent
  extends DialogContentBase
  implements OnInit {
  public formGroup: FormGroup;
  userRegistered = {
    response: false,
    message: ''
  };
  emailValidationRegex = '^(("[\\w-\\s]+")|([\\w-]+(?:\\.[\\w-]+)*)|("[\\w-\\s]+")([\\w-]+(?:\\.[\\w-]+)*))(@((?:[\\w-]+\\.)*\\w[\\w-]{0,66})\\.([a-z]{2,6}(?:\\.[a-z]{2})?)$)|(@\\[?((25[0-5]\\.|2[0-4][0-9]\\.|1[0-9]{2}\\.|[0-9]{1,2}\\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\\]?$)';
  phoneNumberRegex = '^(995)?\\d{9}$';
  event;
  modalSubscription: Subscription;
  constructor(
    public dialog: DialogRef,
    public formBuilder: FormBuilder,
    private userClient: UserClient,
    private openSnackBar: OpenSnackbarService,
    private dialogService: DialogService,
    private userService: UserService
  ) {
    super(dialog);
    this.formGroup = this.formBuilder.group({
      clientNoOrPersonalId: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      registerUserType: [0, [Validators.required]],
    });

    this.checkFormValue();
  }

  ngOnInit() {
  }

  public onCancelAction(): void {
    this.dialog.close({ primary: false });
  }

  public onConfirmAction(event) {
    event.target.classList.add('k-state-disabled');
    this.userRegistered.response = false;
    this.userService.registerUser(this.formGroup.value);
    this.modalSubscription = this.userService.userInfoFromTibcoSub()
      .subscribe(r => {
        if ('response' in r) {
          this.userRegistered = r;
          event.target.classList.remove('k-state-disabled');
          this.modalSubscription
            .unsubscribe();
        } else {
          this.closePrevDialog();
        }
      })
    this.userService.confirmActionResultSub()
      .subscribe(r => {
        if (!r) {
          event.target.classList.remove('k-state-disabled');
        }
      })
  }

  private closePrevDialog() {
    const formValue = this.formGroup.value;
    localStorage.setItem('user_form', JSON.stringify(formValue));
    this.dialog.close({ primary: true });
    this.modalSubscription
      .unsubscribe();
  }

  private checkFormValue() {
    const formValue = localStorage.getItem('user_form');
    if (formValue) {
      this.formGroup.setValue(JSON.parse(formValue))
    }
  }
}
