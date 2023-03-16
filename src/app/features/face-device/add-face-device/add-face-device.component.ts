import { Component } from "@angular/core";
import { DialogRef } from "@progress/kendo-angular-dialog";
import { FaceDeviceClient, IdResponse } from "../../../services/admin.api.client";
import { Router } from "@angular/router";
import { OpenSnackbarService } from "../../../services/open-snackbar.service";

@Component({
  selector: 'app-add-face-device',
  templateUrl: './add-face-device.component.html',
  styleUrls: ['./add-face-device.component.scss']
})

export class AddFaceDeviceComponent {
  submitted = false;
  deviceID: string | undefined;

  addDevice = {
    response: false,
    message: null
  };

  constructor(private dialog: DialogRef, private faceDeviceClient: FaceDeviceClient, private router: Router, private snackBar: OpenSnackbarService) {
  }

  onCancelAction(): void {
    this.dialog.close({ primary: false })
  }

  onConfirmAction(): void {
    this.submitted = true;
    this.addDevice.response = false;
    if (this.deviceID) {
      this.faceDeviceClient.faceDeviceRegister({ deviceId: this.deviceID })
        .subscribe((r: IdResponse) => {
          console.log(r);
          this.dialog.close({ primary: true });
          try {
            this.router.navigate([`facedevice/${r.id}`])
              .then()
              .catch(e => {
                throw e;
              })
          } catch (e) {
            console.log(e)
          }
        },
          error => {
            this.addDevice.response = true;
            this.addDevice.message = error.result.message;
          });
    }
  }
}
