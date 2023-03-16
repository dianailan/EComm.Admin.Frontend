import { Component } from '@angular/core';
import { DialogContentBase, DialogRef } from "@progress/kendo-angular-dialog";
import { GenerateQRGroupRequestModel, QRCodeClient } from "../../../services/admin.api.client";
import { OpenSnackbarService } from "../../../services/open-snackbar.service";
import { ApiResponse } from "../../../services/admin.api.client";

@Component({
  selector: 'app-generate-group',
  templateUrl: './generate-group.component.html',
  styleUrls: ['./generate-group.component.scss']
})
export class GenerateGroupComponent extends DialogContentBase {
  quantity: number;
  error = {
    success: true,
    message: ''
  };

  constructor(
    public dialog: DialogRef,
    private codeClient: QRCodeClient,
    private snackbarService: OpenSnackbarService
  ) {
    super(dialog);
  }

  onCancelAction() {
    this.dialog.close({ primary: false })
  }

  generateGroup(event) {
    event.target.classList.add('k-state-disabled');
    const body: GenerateQRGroupRequestModel = {
      quantity: Math.abs(this.quantity)
    };
    this.codeClient.generateGroup(body)
      .subscribe(response => {
        this.dialog.close({ primary: true });
        this.snackbarService.openSnackBarSuccess(`პორცია ${response.qrGroupId} დაგენერირდა`);
      }, error => {
        const apiResponse = error.result as ApiResponse;
        this.error.message = apiResponse.message;
        this.error.success = false;
        event.target.classList.remove('k-state-disabled');
        setTimeout(() => {
          this.error.success = true;
        }, 2000);
      })
  }
}
