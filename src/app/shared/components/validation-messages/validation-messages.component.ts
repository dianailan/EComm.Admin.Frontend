import { Component, Input } from '@angular/core';
import { FormGroup } from "@angular/forms";

export const errorMessages = {
  pattern: 'არასწორი ფორმატი',
  required: 'ველის შევსება სავალდებულოა',
  minlength: 'ველის მინიმალური რაოდენობა',
  maxlength: 'ველის მაქსიმალური რაოდენობა',
};

@Component({
  selector: 'app-validation-messages',
  templateUrl: './validation-messages.component.html',
  styleUrls: ['./validation-messages.component.scss']
})
export class ValidationMessagesComponent {
  errors = errorMessages;
  @Input() formGroup: FormGroup;
  @Input() controlName: string;
  @Input() minlength: string;
  @Input() maxlength: string;
  @Input() patternErrorMessage: string = null;
}
