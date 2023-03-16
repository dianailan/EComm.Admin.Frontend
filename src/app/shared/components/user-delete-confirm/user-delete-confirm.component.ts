import { Component, Input, OnInit } from '@angular/core';
import { DialogContentBase, DialogRef } from "@progress/kendo-angular-dialog";
import { UserClient, UserReferenceModel } from "../../../services/admin.api.client";

@Component({
  selector: 'app-user-delete-confirm',
  templateUrl: './user-delete-confirm.component.html',
  styleUrls: ['./user-delete-confirm.component.scss']
})
export class UserDeleteConfirmComponent extends DialogContentBase implements OnInit {
  companyList: UserReferenceModel[];

  constructor(
    public dialog: DialogRef
  ) {
    super(dialog);
  }

  @Input()
  set setCompanyList(list) {
    this.companyList = list;
  }

  ngOnInit() {
  }

  public onCancelAction(): void {
    this.dialog.close({ text: 'No', primary: false });
  }

  public onConfirmAction() {
    this.dialog.close({ text: 'Yes', primary: true });
  }
}
