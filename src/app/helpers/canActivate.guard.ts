import { Injectable } from "@angular/core";
import {
  CanLoad,
  Route,
  Router,
  UrlSegment
} from "@angular/router";
import { Observable } from "rxjs";
import { UserService } from "../services/user.service";

@Injectable()
export class CanActivateGuard implements CanLoad {
  permissions: string[];
  constructor(private router: Router, private userService: UserService) {
    this.permissions = JSON.parse(localStorage.getItem('user_permissions'));
  }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkUserPermission(route);
  }

  async checkUserPermission(route): Promise<boolean> {
    if (this.permissions == null) {
      let info = await this.userService.loadPermissions();
      this.permissions = info.permissions;
    }
    let routePermissions = route.data.permissions as Array<string> ?? [];
    let hasPermissions = false;

    for (let i = 0; i < routePermissions.length; i++) {
      if (this.permissions.includes(routePermissions[i])) {
        hasPermissions = true;
        break;
      }
    }
    if (!hasPermissions) {
      this.router.navigate(['dashboard'])
        .then()
        .catch();
    }
    return hasPermissions;
  }
}
