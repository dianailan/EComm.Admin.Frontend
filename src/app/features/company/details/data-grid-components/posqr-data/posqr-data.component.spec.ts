import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PosqrDataComponent } from './posqr-data.component';

describe('PosqrDataComponent', () => {
  let component: PosqrDataComponent;
  let fixture: ComponentFixture<PosqrDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PosqrDataComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PosqrDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
