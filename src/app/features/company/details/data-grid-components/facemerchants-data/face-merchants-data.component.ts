import { Component, Input, Output } from "@angular/core";
import { CompanyDetailsFaceMerchant, ServiceStatus } from "../../../../../services/admin.api.client";
import { Subject } from "rxjs";

@Component({
  selector: 'app-face-merchants-data',
  templateUrl: './face-merchants-data.component.html',
  styleUrls: ['./face-merchants-data.component.scss']
})

export class FaceMerchantsDataComponent {
  @Input() gridData: CompanyDetailsFaceMerchant[];
  @Input() isCompanyCanceled: boolean;
  @Output() updateFaceMerchantStatusSubject: Subject<{ id: number, status: ServiceStatus }> = new Subject<{ id: number, status: ServiceStatus }>();

  checkPaymentMerchantExternalId(pme) {
    return pme !== null && pme !== undefined && pme !== '';
  }

  updateFaceMerchantStatus(id: number, status: ServiceStatus) {
    this.updateFaceMerchantStatusSubject.next({ id, status })
  }
}
