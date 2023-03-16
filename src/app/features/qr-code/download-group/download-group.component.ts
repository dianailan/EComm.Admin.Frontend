import { Component } from '@angular/core';
import { DialogContentBase, DialogRef } from "@progress/kendo-angular-dialog";
import { QRCodeClient } from "../../../services/admin.api.client";
import { DownloadService } from "../../../services/download.service";

@Component({
  selector: 'app-download-group',
  templateUrl: './download-group.component.html',
  styleUrls: ['./download-group.component.scss']
})
export class DownloadGroupComponent extends DialogContentBase {
  groupIdentifier;
  groupType = 1;
  error = {
    success: true,
    message: ''
  };

  constructor(public dialog: DialogRef, private codeClient: QRCodeClient, private download: DownloadService) {
    super(dialog);
  }

  onCancelAction() {
    this.dialog.close({ primary: false })
  }

  printGroup(event) {
    event.target.classList.add('k-state-disabled');
    this.codeClient.printGroup(this.groupIdentifier.trim(), this.groupType)
      .subscribe((res) => {
        this.download.download(res);
        this.groupIdentifier = '';
        this.dialog.close({ primary: true });
      }, () => {
        this.error.message = 'დაფიქსირდა შეცდომა';
        this.error.success = false;
        event.target.classList.remove('k-state-disabled');
        setTimeout(() => {
          this.error.success = true;
        }, 2000)
      });
  }
}
