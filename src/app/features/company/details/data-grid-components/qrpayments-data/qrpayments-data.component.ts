import { Component, Input, Output } from "@angular/core";
import { CompanyDetailsQRPayment, ServiceStatus } from "../../../../../services/admin.api.client";
import { Subject } from "rxjs";

@Component({
  selector: 'app-qrpayments-data',
  templateUrl: './qrpayments-data.component.html',
  styleUrls: ['./qrpayments-data.component.scss']
})

export class QrpaymentsDataComponent {
  @Input() gridData: CompanyDetailsQRPayment[];
  @Input() isCompanyCanceled: boolean;
  @Output() updateQRPaymentStatusSubject: Subject<{ id: number, status: ServiceStatus }> = new Subject<{ id: number, status: ServiceStatus }>();
  isLoading = false;

  updateQrPaymentStatus(id, status) {
    this.updateQRPaymentStatusSubject.next({ id, status });
  }

  checkPaymentMerchantExternalId(pme) {
    return pme !== null && pme !== undefined && pme !== '';
  }
}
