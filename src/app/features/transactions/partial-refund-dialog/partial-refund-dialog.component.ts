import { Component } from "@angular/core";
import { DialogContentBase, DialogRef } from "@progress/kendo-angular-dialog";

@Component({
  selector: 'app-confirm-action',
  templateUrl: './partial-refund-dialog.component.html',
  styleUrls: ['./partial-refund-dialog.component.scss']
})

export class PartialRefundDialogComponent extends DialogContentBase {
  refundType: number = 0;
  refundAmount: string;
  errorMessage: string = null;
  partialReadonly: boolean = false;
  amount: number;
  constructor(
    public dialog: DialogRef
  ) {
    super(dialog);
  }

  public onCancelAction(): void {
    this.dialog.close({ primary: false });
  }

  public onConfirmAction(event) {
    this.errorMessage = null;
    event.target.classList.add('k-state-disabled');
    if (parseInt(this.refundAmount) > this.amount) {
      this.errorMessage = 'დასაბრუნებელი თანხა აღემატება ავტორიზაციის თანხას';
      event.target.classList.remove('k-state-disabled');
      return;
    }
    const reg = RegExp("^[0-9]+([.|,][0-9]+)?$");
    if (this.refundType === 1) {
      if (this.refundAmount === null) {
        this.errorMessage = 'შეიყვანეთ რაოდენობა';
        event.target.classList.remove('k-state-disabled');
        return;
      } else if (parseFloat(this.refundAmount) === 0) {
        this.errorMessage = 'რაოდენობა უნდა იყოს 0-ზე მეტი';
        event.target.classList.remove('k-state-disabled');
        return;
      } else if (!(reg.test(this.refundAmount))) {
        this.errorMessage = 'არასწორი ფორმატი';
        event.target.classList.remove('k-state-disabled');
        return;
      }
    }
    this.dialog.close({ primary: true, refundType: this.refundType, refundAmount: this.refundAmount });
  }
}
