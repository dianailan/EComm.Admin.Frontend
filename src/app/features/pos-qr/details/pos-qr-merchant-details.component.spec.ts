import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PosQrMerchantDetailsComponent } from './pos-qr-merchant-details.component';

describe('PosQrMerchantDetailsComponent', () => {
  let component: PosQrMerchantDetailsComponent;
  let fixture: ComponentFixture<PosQrMerchantDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PosQrMerchantDetailsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PosQrMerchantDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
