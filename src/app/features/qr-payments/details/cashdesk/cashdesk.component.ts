import { Component, Input, Output } from "@angular/core";
import { QrCashDeskModel } from "../../../../services/admin.api.client";
import { Subject } from "rxjs";

@Component({
  selector: 'app-cashdesks',
  templateUrl: './cashdesk.component.html',
  styleUrls: ['./cashdesk.component.scss']
})

export class CashdeskComponent {
  cashiers = [0, 1, 2];
  cashDeskName: string;

  @Input() cashDesks: QrCashDeskModel[];
  @Input() isMerchantCanceled: boolean;
  @Output() deleteCashDestSubject: Subject<number> = new Subject<number>();
  @Output() addCashierSubject: Subject<any> = new Subject<number>();
  @Output() addDeviceSubject: Subject<any> = new Subject<number>();
  @Output() updateCashDeskNameSubject: Subject<any> = new Subject<{ cashDeskName: string, cashDeskId: number }>();
  @Output() deleteCashierSubject: Subject<any> = new Subject<{ cashDeskCashierId: number }>();
  @Output() deleteDeviceSubject: Subject<any> = new Subject<{ cashDeskId: number, deviceId: number }>();
  @Output() generateQrSubject: Subject<number> = new Subject<number>();
  @Output() printQrSubject: Subject<string> = new Subject<string>();

  constructor() {
  }

  deleteCashDesk(id) {
    this.deleteCashDestSubject.next(id);
  }

  addCashierToCashDesk(id) {
    this.addCashierSubject.next(id);
  }

  addDeviceToCashDesk(id) {
    this.addDeviceSubject.next(id);
  }

  updateCashDeskName(name, id) {
    const object = {
      cashDeskName: name,
      cashDeskId: id
    };
    this.updateCashDeskNameSubject.next(object)
  }

  deleteCashier(cashDeskCashierId) {
    const object = {
      cashDeskCashierId
    };
    this.deleteCashierSubject.next(object);
  }

  deleteDevice(cashDeskDeviceId: number) {
    const object = {
      cashDeskDeviceId,
    };
    this.deleteDeviceSubject.next(object);
  }

  generateQr(id) {
    this.generateQrSubject.next(id);
  }

  printQr(qrCode) {
    this.printQrSubject.next(qrCode);
  }
}
