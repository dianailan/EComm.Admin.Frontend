import { Component } from "@angular/core";
import { DialogRef } from "@progress/kendo-angular-dialog";
import { UserClient, UserDetailsModel } from "../../../services/admin.api.client";
import { OpenSnackbarService } from "../../../services/open-snackbar.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-check-user',
  templateUrl: './check-user.component.html',
  styleUrls: ['./check-user.component.scss']
})

export class CheckUserComponent {
  userClientNo = '';
  submitted = false;

  userFound = {
    response: false,
    message: ''
  };

  constructor(private dialog: DialogRef, private userClient: UserClient, private snackBar: OpenSnackbarService, private router: Router) {
  }

  onCancelAction(): void {
    this.dialog.close({ primary: false })
  }

  onConfirmAction(): void {
    this.submitted = true;
    if (this.userClientNo !== '') {
      this.userClient.getUserInfo(this.userClientNo)
        .subscribe((r: UserDetailsModel) => {
          const params = {
            firstName: r.firstname,
            lastName: r.lastname,
            email: r.email,
            phone: r.phoneNumber,
            clientNo: this.userClientNo,
            id: r.id
          };
          this.router.navigate([`companies/registerCompany`], { queryParams: params })
            .then()
            .catch(e => {
              throw e;
            })
        }, error => {
          this.snackBar.openSnackBarDanger(error.result.message);
        })
    }
  }
}
