import { Injectable } from "@angular/core";

@Injectable()
export class MerchantService {
  public buildModel(formValue: object) {
    for (const key in formValue) {
      if (typeof formValue[key] === "object") {
        this.buildModel(formValue[key])
      }
      formValue[key] = formValue[key] !== '' && formValue[key] !== undefined ? formValue[key] : null;
    }

    return formValue;
  }
}
