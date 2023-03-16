import { Component, Input, OnInit } from "@angular/core";
import { DialogContentBase, DialogRef } from "@progress/kendo-angular-dialog";
import { PaymentMerchantData, UserCompanyDetails, UserRole } from "../../../../../services/admin.api.client";
interface ICompanyMerchants extends PaymentMerchantData {
  isChecked: boolean
}

@Component({
  selector: 'app-change-user-role',
  templateUrl: './change-user-role.component.html',
  styleUrls: ['./change-user-role.component.scss']
})

export class ChangeUserRoleComponent extends DialogContentBase implements OnInit {
  userRole: number = 1;
  @Input() userCompanyDetails: UserCompanyDetails;
  companyMerchants: ICompanyMerchants[];
  paymentMerchantIds: number[];

  constructor(public dialog: DialogRef) {
    super(dialog);
  }

  ngOnInit() {
    this.companyMerchants = this.userCompanyDetails?.paymentMerchants?.map(p => {
      return { ...p, isChecked: true }
    });
    this.userRole = this.userCompanyDetails.roleId;
    this.checkRole()
  }

  checkRole() {
    if (this.userRole === UserRole.SuperAdmin) {
      this.companyMerchants.forEach(m => m.isChecked = true)
      this.paymentMerchantIds = this.companyMerchants.map(m => m.id);
    } else {
      this.companyMerchants.forEach(m => m.isChecked = this.userCompanyDetails.paymentMerchants.filter(um => um.id === m.id)[0].isEnabled)
      this.paymentMerchantIds = this.companyMerchants.filter(m => m.isEnabled).map(m => m.id);
    }
  }

  addMerchants(event): void {
    let value = parseInt(event.target.value)
    if (event.target.checked) {
      this.paymentMerchantIds.push(value);
    } else {
      let m = [...this.paymentMerchantIds];
      this.paymentMerchantIds = m.filter(id => id !== value)
    }
  }

  onCancelAction() {
    this.dialog.close({ primary: false });
  }

  onConfirmAction() {
    this.dialog.close({ primary: true, role: this.userRole, paymentMerchantIds: this.paymentMerchantIds })
  }
}
