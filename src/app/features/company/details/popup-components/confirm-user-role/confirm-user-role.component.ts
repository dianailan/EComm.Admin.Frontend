import { Component, Input, OnInit } from "@angular/core";
import { DialogContentBase, DialogRef } from "@progress/kendo-angular-dialog";
import { UserCompanyDetails, WebPageDetails } from "../../../../../services/admin.api.client";

@Component({
  selector: 'app-confirm-user-role',
  templateUrl: './confirm-user-role.component.html',
  styleUrls: ['./confirm-user-role.component.scss']
})

export class ConfirmUserRoleComponent extends DialogContentBase implements OnInit {
  @Input() userRole
  @Input() webpages: UserCompanyDetails;
  constructor(public dialogRef: DialogRef) {
    super(dialogRef);
  }

  ngOnInit() {
  }

  onCancelAction() {
    this.dialog.close({ primary: true, confirmed: false });
  }

  onConfirmAction() {
    this.dialog.close({ primary: true, confirmed: true })
  }
}
