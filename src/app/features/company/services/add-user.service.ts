import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { UserDetailsModel } from "../../../services/admin.api.client";

@Injectable({
  providedIn: 'root'
})

export class AddUserService {
  private checkClientNumberSubject: Subject<string> = new Subject<string>()
  private userInfoSubject: Subject<UserDetailsModel> = new Subject<UserDetailsModel>()

  public clientNumber(number: string) {
    this.checkClientNumberSubject.next(number)
  }

  public clientNumberSub(): Observable<string> {
    return this.checkClientNumberSubject.asObservable()
  }

  public userInfo(info: UserDetailsModel) {
    this.userInfoSubject.next(info)
  }

  public userInfoSub(): Observable<UserDetailsModel> {
    return this.userInfoSubject.asObservable()
  }
}
