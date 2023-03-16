import { Component, Input, Output } from "@angular/core";
import {
  CompanyDetailsQRMerchant,
  CompanyDetailsQRPayment,
  ServiceStatus
} from "../../../../../services/admin.api.client";
import { Subject } from "rxjs";

@Component({
  selector: 'app-qrmerchants-data',
  templateUrl: './qrmerchants-data.component.html',
  styleUrls: ['./qrmerchants-data.component.scss']
})

export class QrmerchantsDataComponent {
  @Input() gridData: CompanyDetailsQRMerchant[];
  @Input() isCompanyCanceled: boolean;
  @Output() updateQRMerchantStatusSubject: Subject<{ id: number, status: ServiceStatus }> = new Subject<{ id: number, status: ServiceStatus }>();
  isLoading = false;

  updateQrMerchantStatus(id, status) {
    this.updateQRMerchantStatusSubject.next({ id, status });
  }

  checkPaymentMerchantExternalId(pme) {
    return pme !== null && pme !== undefined && pme !== '';
  }
}
