import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable()

export class RegisterPosQrTerminalService {
  private merchantExternalId = new BehaviorSubject<string>('');
  public share = this.merchantExternalId.asObservable();

  constructor() { }

  updateData(id) {
    this.merchantExternalId.next(id);
  }
}
