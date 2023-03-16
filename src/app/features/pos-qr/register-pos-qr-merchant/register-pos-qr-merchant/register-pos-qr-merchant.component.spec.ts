import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterPosQrMerchantComponent } from './register-pos-qr-merchant.component';

describe('RegisterPosQrMerchantComponent', () => {
  let component: RegisterPosQrMerchantComponent;
  let fixture: ComponentFixture<RegisterPosQrMerchantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterPosQrMerchantComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterPosQrMerchantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
