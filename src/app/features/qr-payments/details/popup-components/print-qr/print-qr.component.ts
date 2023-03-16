import { Component } from "@angular/core";
import { DialogRef } from "@progress/kendo-angular-dialog";

@Component({
  selector: 'app-print-qr',
  templateUrl: './print-qr.component.html',
  styleUrls: ['./print-qr.component.scss']
})

export class PrintQrComponent {
  qrType: number = 1;

  constructor(private dialog: DialogRef) {
  }

  onCancelAction() {
    this.dialog.close({ primary: false })
  }

  onConfirmAction() {
    this.dialog.close({ primary: true, qrType: this.qrType })
  }
}
