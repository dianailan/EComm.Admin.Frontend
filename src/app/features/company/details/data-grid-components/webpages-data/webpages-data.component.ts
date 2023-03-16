import { Component, Input, Output } from "@angular/core";
import {
  ServiceStatus,
  WebPageDetails
} from "../../../../../services/admin.api.client";
import { Subject } from "rxjs";
import { Validators } from "@angular/forms";

@Component({
  selector: 'app-webpages-data',
  templateUrl: './webpages-data.component.html',
  styleUrls: ['./webpages-data.component.scss']
})

export class WebpagesDataComponent {
  @Input() gridData: WebPageDetails[];
  @Input() isCompanyCanceled: boolean;
  @Output() changeStatusSubject: Subject<{ id: number, status: ServiceStatus }> = new Subject<{ id: number, status: ServiceStatus }>();
  isLoading = false;

  requiredFields = ['limitPerTransaction', 'limitPerDay', 'limitPerMonth', 'tradeName', 'paymentMerchantExternalId', 'mccCodeId'];

  updateWebPageStatus(id: number, status: ServiceStatus,) {
    this.changeStatusSubject.next({ id, status })
  }

  checkWebPageDetails(details: object) {
    for (let i = 0; i < this.requiredFields.length; i++) {
      if (details[this.requiredFields[i]] == null || details[this.requiredFields[i]] == undefined || details[this.requiredFields[i]] == '') {
        return false;
      }
    }
    return true;
  }
}
