import { Injectable } from '@angular/core';
import { AccountClient, AccountDetails } from "./admin.api.client";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private accountClient: AccountClient) {
  }

  loadPermissions(): Promise<AccountDetails> {
    return this.accountClient.getAccountDetails().toPromise();
  }

  get permissions() {
    let permissions = JSON.parse(localStorage.getItem('user_permissions'));
    if (!permissions) {
      const waitForPermissions = setInterval(() => {
        permissions = JSON.parse(localStorage.getItem('user_permissions'));
        if (permissions) {
          clearInterval(waitForPermissions);
        }
      }, 500)
    }
    return permissions;
  }

  set permissions(permissions: string[]) {
    localStorage.setItem('user_permissions', JSON.stringify(permissions));
  }

  logOut() {
    localStorage.removeItem('user_permissions');
    window.location.href = '../Account/Logout';
  }
}
