import { DebugElement } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { PageDetails } from "./web-page-details.component";

describe('FilterPanelComponent', () => {
  let component: PageDetails;
  let fixture: ComponentFixture<PageDetails>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PageDetails],
      imports: [],
      providers: []
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call showConfirm() on onConfirmDialog()', () => {
    spyOn(component, 'showConfirm').and.callThrough();
    component.onConfirmDialog(event);
    expect(component.showConfirm).toHaveBeenCalled()
  });

  it('should call onConfirmDialog() when radio button is changed', () => {
    spyOn(component, 'onConfirmDialog').and.callThrough();
    let options: DebugElement[] = fixture.debugElement.queryAll(By.css('input[type="radio"]'));
    options[1].triggerEventHandler('change', { target: options[1].nativeElement });
    expect(component.onConfirmDialog).toHaveBeenCalled();
  });

  it('click should change checkbox value', () => {
    let box = fixture.debugElement.query(By.css('#isRecurringEnabled')).nativeElement;
    expect(box.checked).toBeFalsy();
    box.click();
    expect(box.checked).toBeTruthy();
  });

  it('should call changeRecurringType() when checkbox is clicked', () => {
    spyOn(component, 'changeRecurringType').and.callThrough();
    let box = fixture.debugElement.query(By.css('#isRecurringEnabled'));
    box.triggerEventHandler('change', { target: box.nativeElement });
    expect(component.changeRecurringType).toHaveBeenCalled();
  });
})
