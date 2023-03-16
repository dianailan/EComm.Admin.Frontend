import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterPosTerminalComponent } from './register-pos-terminal.component';

describe('RegisterPosTerminalComponent', () => {
  let component: RegisterPosTerminalComponent;
  let fixture: ComponentFixture<RegisterPosTerminalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterPosTerminalComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterPosTerminalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
