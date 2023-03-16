import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { DialogRef } from "@progress/kendo-angular-dialog";

@Component({
  selector: 'app-add-device',
  templateUrl: './add-device.component.html',
  styleUrls: ['./add-device.component.scss']
})

export class AddDeviceComponent {
  submitted = false;
  formGroup: FormGroup = new FormGroup({
    deviceSerialNumber: new FormControl('', Validators.required),
    deviceSimCardNumber: new FormControl('', Validators.required),
  });
  constructor(private dialog: DialogRef) {
  }

  onCancelAction() {
    this.dialog.close({ primary: false })
  }

  onConfirmAction() {
    this.submitted = true;
    if (this.formGroup.valid) {
      this.dialog.close({ primary: true, deviceInfo: this.formGroup.value })
    }
  }
}
