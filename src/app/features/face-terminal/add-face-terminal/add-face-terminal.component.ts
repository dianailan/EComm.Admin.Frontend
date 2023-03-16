import { Component } from "@angular/core";
import { DialogRef } from "@progress/kendo-angular-dialog";
import { FaceTerminalClient, IdResponse } from "../../../services/admin.api.client";
import { Router } from "@angular/router";
import { OpenSnackbarService } from "../../../services/open-snackbar.service";

@Component({
  selector: 'app-add-face-terminal',
  templateUrl: './add-face-terminal.component.html',
  styleUrls: ['./add-face-terminal.component.scss']
})

export class AddFaceTerminalComponent {
  submitted = false;
  merchantExternalId: string;
  terminalNo: string | undefined;

  addTerminal = {
    response: false,
    message: null
  };

  constructor(private dialog: DialogRef, private faceTerminalClient: FaceTerminalClient, private router: Router, private snackBar: OpenSnackbarService) {
  }

  onCancelAction(): void {
    this.dialog.close({ primary: false })
  }

  onConfirmAction(): void {
    this.submitted = true;
    this.addTerminal.response = false;
    if (this.merchantExternalId && this.terminalNo) {
      this.faceTerminalClient.addFaceTerminalRegister(this.merchantExternalId, { terminalNo: this.terminalNo })
        .subscribe((r: IdResponse) => {
          console.log(r);
          this.dialog.close({ primary: true });
          try {
            this.router.navigate([`faceterminal/${r.id}`])
              .then()
              .catch(e => {
                throw e;
              })
          } catch (e) {
            console.log(e)
          }
        }, error => {
          this.addTerminal.response = true;
          this.addTerminal.message = error.result.message;
          // this.snackBar.openSnackBarDanger(error.result.message);
        })
    }
  }
}
