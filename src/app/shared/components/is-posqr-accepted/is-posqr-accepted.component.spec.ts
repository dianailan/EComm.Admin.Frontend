import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IsPosqrAcceptedComponent } from './is-posqr-accepted.component';

describe('IsPosqrAcceptedComponent', () => {
  let component: IsPosqrAcceptedComponent;
  let fixture: ComponentFixture<IsPosqrAcceptedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IsPosqrAcceptedComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IsPosqrAcceptedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
