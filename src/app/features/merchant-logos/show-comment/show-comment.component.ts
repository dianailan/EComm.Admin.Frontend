import { Component, Input } from "@angular/core";
import { DialogContentBase, DialogRef } from "@progress/kendo-angular-dialog";

@Component({
  selector: 'app-show-comment',
  templateUrl: './show-comment.component.html',
  styleUrls: ['./show-comment.component.scss']
})

export class ShowCommentComponent extends DialogContentBase {
  @Input() comment: string;

  constructor(public dialogRef: DialogRef) {
    super(dialogRef);
  }
}
