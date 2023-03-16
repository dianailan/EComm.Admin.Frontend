import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PosqrterminalDataComponent } from './posqrterminal-data.component';

describe('PosqrterminalDataComponent', () => {
  let component: PosqrterminalDataComponent;
  let fixture: ComponentFixture<PosqrterminalDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PosqrterminalDataComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PosqrterminalDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
