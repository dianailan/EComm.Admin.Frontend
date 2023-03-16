import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PosTerminalComponent } from './pos-terminal.component';

describe('PosTerminalComponent', () => {
  let component: PosTerminalComponent;
  let fixture: ComponentFixture<PosTerminalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PosTerminalComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PosTerminalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
