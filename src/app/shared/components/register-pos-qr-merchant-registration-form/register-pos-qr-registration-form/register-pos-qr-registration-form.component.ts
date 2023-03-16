import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import { Observable } from "rxjs";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MccCode } from "src/app/services/admin.api.client";

@Component({
  selector: 'app-register-pos-qr-registration-form',
  templateUrl: './register-pos-qr-registration-form.component.html',
  styleUrls: ['./register-pos-qr-registration-form.component.scss']
})
export class RegisterPosQrRegistrationFormComponent implements OnInit {
  formGroup: FormGroup;
  public submitted = false;
  @Input() formSubmit: Observable<any>;
  @Input() mccCodes: MccCode[];
  @Input() registerWithTerminal: boolean;
  @Output() form: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();

  constructor(private formBuilder: FormBuilder) {
    this.buildFormGroup();
  }

  public buildFormGroup() {
    this.formGroup = this.formBuilder.group({
      tradeName: ['', [Validators.required, Validators.maxLength(27)]],
      mccCodeId: [null, [Validators.required]],
      paymentMerchantExternalId: [null, [Validators.pattern("^[0-9]*$")]],
      terminal: this.formBuilder.group({
        terminalNo: [null],
        physicalTerminalNo: [null],
        isBnplEnabled: [false],
      })
    })
  }

  ngOnInit(): void {
    this.formSubmit
      .subscribe(
        r => {
          if (r) {
            this.submitted = true;
            if (this.formGroup.invalid) {
              return;
            }
            this.form.emit(this.formGroup)
          }
        }
      )
  }
}
