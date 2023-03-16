import { Component, Input } from "@angular/core";
import { SubmitUserRegistration } from "../../../services/admin.api.client";
import { DialogContentBase, DialogRef } from "@progress/kendo-angular-dialog";

@Component({
  selector: 'app-user-registration-preview',
  templateUrl: './user-registration-preview.component.html',
  styleUrls: ['./user-registration-preview.component.scss']
})

export class UserRegistrationPreviewComponent extends DialogContentBase {
  userData: SubmitUserRegistration;
  incorrectFields = false;
  message = '';
  personalIdReadonly = true;

  @Input()
  setUserData(data: SubmitUserRegistration) {
    this.userData = data;
    if (!this.userData.personalId) {
      this.personalIdReadonly = false;
    }
  }
  constructor(public dialog: DialogRef) {
    super(dialog);
  }

  onCancelAction() {
    this.dialog.close({ primary: false })
  }

  onConfirmAction(e) {
    this.incorrectFields = false;
    if (!(this.userData.personalId)) {
      this.incorrectFields = true;
      this.message = 'პ/ნ ველი არ უნდა იყოს ცარიელი';
      return;
    }
    if (this.userData.personalId.length > 20) {
      this.incorrectFields = true;
      this.message = 'პ/ნ ველის სიგრძე არ უნდა აღემატებოდეს 20-ს';
      return;
    }
    this.dialog.close({ primary: true })
  }
}
