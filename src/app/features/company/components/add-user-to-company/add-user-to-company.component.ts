import { Component } from "@angular/core";
import {
  AddUserToCompany,
  CompanyClient,
  PaymentMerchantData,
  UserClient,
  UserDetailsModel,
  UserRole
} from "../../../../services/admin.api.client";
import { ActivatedRoute, Router } from "@angular/router";

//
// interface AddUserToCompany {
//   clientNo: string,
//   userRole: UserRole,
//   merchants: number[]
// }

interface ICompanyMerchants extends PaymentMerchantData {
  isChecked: boolean
}

@Component({
  selector: 'app-add-user-to-company',
  templateUrl: './add-user-to-company.component.html',
  styleUrls: ['./add-user-to-company.component.scss']
})

export class AddUserToCompanyComponent {
  companyId: string;
  userName: string;
  userDetails: UserDetailsModel;
  companyMerchants: ICompanyMerchants[];

  user: AddUserToCompany = {
    clientNo: '',
    role: UserRole.SuperAdmin,
    paymentMerchantIds: []
  }

  constructor(
    private userClient: UserClient,
    private companyClient: CompanyClient,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.activatedRoute.params
      .subscribe(r => {
        this.companyId = r['id']
      })
  }

  checkUser() {
    this.userClient.getUserInfo(this.user.clientNo)
      .subscribe((r) => {
        this.userDetails = r;
        this.getCompanyUserMerchants()
      }, error => {
        console.log(error)
      })
  }

  getCompanyUserMerchants() {
    this.companyClient.getCompanyPaymentMerchants(parseInt(this.companyId))
      .subscribe((r) => {
        this.companyMerchants = r.map(p => {
          return { ...p, isChecked: true }
        });
        this.user.paymentMerchantIds = r.map(m => m.id);
      }, error => {
        console.log(error)
      })
  }

  addUser() {
    this.companyClient.addUserToCompany(parseInt(this.companyId), this.user)
      .subscribe(r => {
        this.router.navigate([`companies/${this.companyId}`])
      })
  }

  checkMerchantId(id: number): boolean {
    return this.user.paymentMerchantIds.includes(id)
  }

  checkRole() {
    if (this.user.role === UserRole.SuperAdmin) {
      this.companyMerchants.forEach(m => m.isChecked = true)
      this.user.paymentMerchantIds = this.companyMerchants.map(m => m.id);
    } else {
      this.companyMerchants.forEach(m => m.isChecked = false)
      this.user.paymentMerchantIds = [];
    }
  }

  addMerchants(event): void {
    let value = parseInt(event.target.value)
    console.log(this.user.paymentMerchantIds)
    if (event.target.checked) {
      this.user.paymentMerchantIds.push(value);
    } else {
      let m = [...this.user.paymentMerchantIds];
      this.user.paymentMerchantIds = m.filter(id => id !== value)
    }
    console.log(this.user.paymentMerchantIds)
  }
}
