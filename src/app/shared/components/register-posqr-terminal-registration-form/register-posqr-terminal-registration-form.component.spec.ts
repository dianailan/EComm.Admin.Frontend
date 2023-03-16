import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterPosqrTerminalRegistrationFormComponent } from './register-posqr-terminal-registration-form.component';

describe('RegisterPosqrTerminalRegistrationFormComponent', () => {
  let component: RegisterPosqrTerminalRegistrationFormComponent;
  let fixture: ComponentFixture<RegisterPosqrTerminalRegistrationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterPosqrTerminalRegistrationFormComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterPosqrTerminalRegistrationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
