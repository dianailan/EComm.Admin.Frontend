import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import { Observable } from "rxjs";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-register-posqr-terminal-registration-form',
  templateUrl: './register-posqr-terminal-registration-form.component.html',
  styleUrls: ['./register-posqr-terminal-registration-form.component.scss']
})
export class RegisterPosqrTerminalRegistrationFormComponent implements OnInit {
  formGroup: FormGroup;
  public submitted = false;

  @Input() formSubmit: Observable<any>;
  @Output() form: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();

  constructor(private formBuilder: FormBuilder) {
    this.buildFormGroup();
  }

  public buildFormGroup() {
    this.formGroup = this.formBuilder.group({
      terminalNo: [null, [Validators.required]],
      physicalTerminalNo: [null, [Validators.required]],
      isBnplEnabled: [false],
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
