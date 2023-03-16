import { Component } from "@angular/core";
import { DialogRef } from "@progress/kendo-angular-dialog";
import { FormGroup, FormControl, Validators } from "@angular/forms";

@Component({
  selector: 'app-add-cashier-to-cashdesk',
  templateUrl: './add-cashier-to-cashdesk.component.html',
  styleUrls: ['./add-cashier-to-cashdesk.component.scss']
})
export class addCashierToCashdeskComponent {
  submitted = false;

  formGroup: FormGroup = new FormGroup({
    cashierFirstName: new FormControl('', Validators.required),
    cashierLastName: new FormControl('', Validators.required),
    cashierPhoneNumber: new FormControl('', Validators.required)
  });

  constructor(private dialog: DialogRef) {
  }

  onCancelAction() {
    this.dialog.close({ primary: false });
  }

  onConfirmAction() {
    this.submitted = true;
    if (this.formGroup.valid) {
      this.dialog.close({ primary: true, cashierInfo: this.formGroup.value })
    }
  }
}
