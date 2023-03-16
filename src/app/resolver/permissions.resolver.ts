import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable, of } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { AccountClient, AccountDetails } from "../services/admin.api.client";
import { catchError, map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})

export class PermissionsResolver implements Resolve<AccountDetails> {
  constructor(private http: HttpClient, private accountClient: AccountClient) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<AccountDetails> | Promise<AccountDetails> {
    return this.accountClient.getAccountDetails()
      .pipe(map(r => {
        return r
      }), catchError(err => {
        return of({});
      }))
  }
}
