import { Component } from "@angular/core";
import { DialogRef } from "@progress/kendo-angular-dialog";
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-add-cashdesk-with-device',
  templateUrl: './add-cashdesk-with-device.component.html',
  styleUrls: ['./add-cashdesk-with-device.component.scss']
})

export class AddCashdeskWithDeviceComponent {
  submitted = false;

  formGroup: FormGroup = new FormGroup({
    cashDeskName: new FormControl('', Validators.required),
    cashDeskDeviceSerialNumber: new FormControl('', Validators.required),
    cashDeskDeviceSimCardNumber: new FormControl('', Validators.required)
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
