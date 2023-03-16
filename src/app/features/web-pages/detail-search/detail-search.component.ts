import { Component, EventEmitter, Input, Output } from '@angular/core'
import { CompositeFilterDescriptor, FilterDescriptor } from "@progress/kendo-data-query";
import { FilterService } from "@progress/kendo-angular-grid";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";

@Component({
  selector: 'detail-search',
  templateUrl: './detail-search.component.html',
  styleUrls: ['./detail-search.component.scss'],
  animations: [
    trigger('showHide', [
      state('hide', style({
        width: '0px',
        height: '0px',
        overflow: 'hidden',
        padding: '0'
      })),
      state('show', style({
        width: '*'
      })),
      transition('hide => show', animate('200ms ease-in')),
      transition('show => hide', animate('200ms ease-out'))
    ])
  ],
})

export class DetailSearchComponent {
  private inputChange = new Subject<any>();
  fields = ['limitStatus'];
  limitStatus: string;
  show: boolean = false;
  _filterState: CompositeFilterDescriptor = { filters: [], logic: "and" };
  limitStatusList = [
    { 'key': 'რეალური', 'value': '0' },
    { 'key': 'ელოდება რისკების დასტურს', 'value': '1' },
    { 'key': 'სატესტო', 'value': '2' }];

  constructor(public filterService: FilterService) {
    this.inputChangeSub()
      .pipe(debounceTime(500))
      .subscribe(r => {
        let findField: FilterDescriptor = <FilterDescriptor>this._filterState.filters.find((x: FilterDescriptor) => x.field === r.name);
        if (findField) {
          let index = this._filterState.filters.indexOf(findField);
          this._filterState.filters.splice(index, 1);
          if (r.value?.length > 0) {
            findField.value = r.value;
            this._filterState.filters.push(findField);
          }
        } else {
          this._filterState.filters.push({
            field: r.name,
            operator: "and",
            value: r.value
          });
        }
        this.filterService.filter(this._filterState);
        this.stateChange.emit(this._filterState);
      })
  }

  @Input()
  public set filterState(state: CompositeFilterDescriptor) {
    this._filterState = state;

    this.fields.forEach(el => {
      let find: FilterDescriptor = <FilterDescriptor>this._filterState.filters.find((x: FilterDescriptor) => x.field === el);
      if (find && el === find.field) {
        this[el] = find.value;
        this.show = true;
      } else {
        this[el] = null;
      }
    })
  };

  @Output() stateChange: EventEmitter<CompositeFilterDescriptor> = new EventEmitter<CompositeFilterDescriptor>();

  change(value, name) {
    console.log(name, value)
    this.inputChange.next({ value, name })
  }

  inputChangeSub() {
    return this.inputChange.asObservable();
  }

  openCloseFilter() {
    this.show = !this.show;
    if (!this.show) {
      this.clearValues();
    }
  }

  itemDisabled(itemArgs: { dataItem: { key: string, value: string }, index: number }): boolean {
    return itemArgs.dataItem.value === null;
  }

  clearValues() {
    let fieldIsNotNull: number = 0;
    this.fields.forEach(el => {
      if (this[el]) {
        this[el] = null;
        fieldIsNotNull++;
        this._filterState.filters = this._filterState.filters.filter((x: FilterDescriptor) => x.field !== el);
      }
    });
    if (fieldIsNotNull > 0) {
      this.filterService.filter(this._filterState);
    }
  }
}
