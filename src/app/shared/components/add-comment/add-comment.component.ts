import { Component } from "@angular/core";
import { DialogRef } from "@progress/kendo-angular-dialog";

@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.scss']
})

export class AddCommentComponent {
  comment: string
  constructor(private dialog: DialogRef) {
  }

  onCancelAction(): void {
    this.dialog.close({ primary: false })
  }

  onConfirmAction(): void {
    this.dialog.close({ primary: true, comment: this.comment });
  }
}
