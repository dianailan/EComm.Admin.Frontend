import { Component } from "@angular/core";
import { DialogRef } from "@progress/kendo-angular-dialog";
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-add-cashdesk-with-existing-qr',
  templateUrl: './add-cashdesk-with-existing-qr.component.html',
  styleUrls: ['./add-cashdesk-with-existing-qr.component.scss']
})
export class AddCashdeskWithExistingQrComponent {
  submitted = false;

  formGroup: FormGroup = new FormGroup({
    cashDeskName: new FormControl('', Validators.required),
    cashierFirstName: new FormControl('', Validators.required),
    cashierLastName: new FormControl('', Validators.required),
    cashierPhoneNumber: new FormControl('', Validators.required),
    existingQrCode: new FormControl('', Validators.required)
  });

  constructor(private dialog: DialogRef) {
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
