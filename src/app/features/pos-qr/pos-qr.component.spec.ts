import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PosQrComponent } from './pos-qr.component';

describe('PosQrComponent', () => {
  let component: PosQrComponent;
  let fixture: ComponentFixture<PosQrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PosQrComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PosQrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
