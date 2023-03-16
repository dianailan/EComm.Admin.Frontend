import { Component, Input, Output } from "@angular/core";
import { CompanyDetailsUser } from "../../../../../services/admin.api.client";
import { Subject } from "rxjs";

interface ConfirmRole {
  userId: number,
  requestedMerchantIds: string,
  requestedRole: string
}

@Component({
  selector: 'app-users-grid-data',
  templateUrl: './users-grid-data.component.html',
  styleUrls: ['./users-grid-data.component.scss']
})

export class UsersGridDataComponent {
  @Input() gridData: CompanyDetailsUser[];
  @Input() isCompanyCanceled: boolean;
  @Output() changeUserRoleSubject: Subject<number> = new Subject<number>();
  @Output() confirmUserRoleSubject: Subject<ConfirmRole> = new Subject<ConfirmRole>();
  @Output() cancelUserSubject: Subject<number> = new Subject<number>();
  isLoading = false;

  changeUserRole(userId: number) {
    this.changeUserRoleSubject.next(userId);
  }

  confirmUserRole(userId: number, requestedMerchantIds: string, requestedRole: string) {
    this.confirmUserRoleSubject.next({ userId, requestedMerchantIds, requestedRole });
  }

  cancelUser(userId: number) {
    this.cancelUserSubject.next(userId);
  }
}
