import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RegisterPosQrRegistrationFormComponent } from './register-pos-qr-registration-form.component';

describe('RegisterPosQrRegistrationFormComponent', () => {
  let component: RegisterPosQrRegistrationFormComponent;
  let fixture: ComponentFixture<RegisterPosQrRegistrationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule],
      declarations: [RegisterPosQrRegistrationFormComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterPosQrRegistrationFormComponent);
    component = fixture.componentInstance;
    component.buildFormGroup();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form invalid when empty', () => {
    expect(component.formGroup.valid).toBeFalsy();
  })

  it('name field validity', () => {
    let name = component.formGroup.controls['tradeName'];
    expect(name.valid).toBeFalsy();
  })

  it('name field validity', () => {
    let errors = {};
    let name = component.formGroup.controls['tradeName'];
    errors = name.errors || {};
    expect(errors['required']).toBeTruthy();

    name.setValue('test');
    errors = name.errors;
    expect(errors['pattern']).toBeTruthy();
  })
});
