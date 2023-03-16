import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { DialogContentBase, DialogRef } from "@progress/kendo-angular-dialog";

@Component({
  selector: 'app-add-cashdesk',
  templateUrl: './add-cashdesk.component.html',
  styleUrls: ['./add-cashdesk.component.scss']
})
export class AddCashdeskComponent extends DialogContentBase {
  submitted = false;

  formGroup: FormGroup = new FormGroup({
    cashDeskName: new FormControl('', Validators.required),
    cashierFirstName: new FormControl('', Validators.required),
    cashierLastName: new FormControl('', Validators.required),
    cashierPhoneNumber: new FormControl('', Validators.required),
  });

  constructor(public dialog: DialogRef) {
    super(dialog);
  }

  onCancelAction() {
    this.dialog.close({ primary: false })
  }

  onConfirmAction() {
    this.submitted = true;
    if (this.formGroup.valid) {
      this.dialog.close({ primary: true, cashDesk: this.formGroup.value })
    }
  }
}
