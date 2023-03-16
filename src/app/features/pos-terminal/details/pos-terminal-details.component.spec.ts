import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PosTerminalDetailsComponent } from './pos-terminal-details.component';

describe('PosTerminalDetailsComponent', () => {
  let component: PosTerminalDetailsComponent;
  let fixture: ComponentFixture<PosTerminalDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PosTerminalDetailsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PosTerminalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
