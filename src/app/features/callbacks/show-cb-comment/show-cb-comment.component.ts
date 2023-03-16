import { Component, Input } from "@angular/core";
import { DialogContentBase, DialogRef } from "@progress/kendo-angular-dialog";

@Component({
  selector: 'app-show-cb-comment',
  templateUrl: './show-cb-comment.component.html',
  styleUrls: ['./show-cb-comment.component.scss']
})
export class ShowCbCommentComponent extends DialogContentBase {
  @Input() comment: string;

  constructor(public dialogRef: DialogRef) {
    super(dialogRef);
  }
}
