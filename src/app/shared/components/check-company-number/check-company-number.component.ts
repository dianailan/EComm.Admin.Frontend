import { Component, OnInit } from '@angular/core';
import { DialogContentBase, DialogRef } from "@progress/kendo-angular-dialog";
import { CompanyClient } from "../../../services/admin.api.client";

@Component({
  selector: 'app-check-company-number',
  templateUrl: './check-company-number.component.html',
  styleUrls: ['./check-company-number.component.scss']
})
export class CheckCompanyNumberComponent extends DialogContentBase implements OnInit {
  submitted = false;
  companyIdentificationNumber = '';
  companyFound = {
    response: false,
    message: ''
  };

  constructor(
    public dialog: DialogRef,
    private companyClient: CompanyClient
  ) {
    super(dialog);
  }

  ngOnInit() {
  }

  public onCancelAction(): void {
    this.dialog.close({ primary: false });
  }

  public onConfirmAction(event) {
    this.submitted = true;
    if (this.companyIdentificationNumber !== '') {
      event.target.classList.add('k-state-disabled');
      this.companyClient.findCompanyByIdentificationNumber(this.companyIdentificationNumber.trim())
        .subscribe((response) => {
          this.dialog.close({ primary: true, response });
        }, error => {
          this.companyFound.response = true;
          this.companyFound.message = error.result.message;
          event.target.classList.remove('k-state-disabled');
        })
    }
  }
}
