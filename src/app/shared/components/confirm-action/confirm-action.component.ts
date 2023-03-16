import { Component, Input } from "@angular/core";
import { DialogContentBase, DialogRef } from "@progress/kendo-angular-dialog";

@Component({
  selector: 'app-confirm-action',
  templateUrl: './confirm-action.component.html',
  styleUrls: ['./confirm-action.component.scss']
})

export class ConfirmActionComponent extends DialogContentBase {
  @Input() message: string;
  constructor(
    public dialog: DialogRef
  ) {
    super(dialog);
  }

  public onCancelAction(): void {
    this.dialog.close({ primary: false });
  }

  public onConfirmAction(event) {
    event.target.classList.add('k-state-disabled');
    this.dialog.close({ primary: true })
  }
}
