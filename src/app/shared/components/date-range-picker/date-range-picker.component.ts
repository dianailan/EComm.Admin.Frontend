import { Component, EventEmitter, Input, Output } from "@angular/core";
import * as moment from "moment"
import { DateInputFormatPlaceholder } from "@progress/kendo-angular-dateinputs/dist/es2015/dateinput/models/format-placeholder.model";
import { FilterService } from "@progress/kendo-angular-grid";
import { CompositeFilterDescriptor, FilterDescriptor } from "@progress/kendo-data-query";

@Component({
  selector: 'date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.scss']
})
export class DateRangePickerComponent {
  readonly dateInputFormat: DateInputFormatPlaceholder = {
    year: 'წელი',
    month: 'თვე',
    day: 'დღე',
    hour: '',
    minute: '',
    second: ''
  };

  public _start: Date;
  public _end: Date;

  public filter: CompositeFilterDescriptor = undefined;

  @Input() from: string;
  @Input() to: string;

  @Input()
  public set filterState(val: CompositeFilterDescriptor) {
    this.filter = val;
    const dateFrom = <FilterDescriptor>this.filter.filters.find((x: FilterDescriptor) => x.field === this.from);
    const dateTo = <FilterDescriptor>this.filter.filters.find((x: FilterDescriptor) => x.field === this.to);
    const range = {
      from: dateFrom ? moment(dateFrom.value).toDate() : null,
      to: dateTo ? moment(dateTo.value).toDate() : null
    };
    this._start = range.from;
    this._end = range.to;
  }

  @Output() dateRangeChange: EventEmitter<object[]> = new EventEmitter();

  constructor(public filterService: FilterService) {
  }

  public set start(val) {
    this._start = val;
  }

  public set end(val) {
    this._end = val;
  }

  public filterRange(start: Date, end: Date): void {
    this.removeFieldFromState(this.from);
    this.removeFieldFromState(this.to);

    const filters = [];
    if (start) {
      filters.push({
        field: this.from,
        operator: "gte",
        value: start
      });
    }

    if (end) {
      filters.push({
        field: this.to,
        operator: "lte",
        value: end
      });
    }
    const root = this.filter || {
      logic: "and",
      filters: []
    };

    if (filters.length) {
      root.filters.push(...filters);
    }
    this.dateRangeChange.emit(filters);
    if (this.filter) {
      this.filterService.filter(root);
    }
  }

  public resetDate() {
    this.filter.filters = this.filter.filters.filter((x: FilterDescriptor) => {
      return x.field !== this.from && x.field !== this.to
    });
    this._start = null;
    this._end = null;
    const root = this.filter || {
      logic: "and",
      filters: []
    };
    this.filterService.filter(root)
  }

  setCurrentDate() {
    const today = moment().startOf('day').toDate();
    const range = {
      start: today,
      end: today
    };
    this.start = range.start;
    this.end = range.end;
    this.filterRange(range.start, range.end);
  }

  setYesterdayDate() {
    const yesterday = moment().startOf('day').subtract(1, 'days').toDate();
    const range = {
      start: yesterday,
      end: yesterday
    };
    this.start = range.start;
    this.end = range.end;
    this.filterRange(range.start, range.end);
  }

  setWeek() {
    const dateFrom = moment().startOf('day').subtract(6, 'days').toDate();
    const dateTo = moment().startOf('day').toDate();

    const range = {
      start: dateFrom,
      end: dateTo
    };
    this.start = range.start;
    this.end = range.end;
    this.filterRange(range.start, range.end);
  }

  setMonth() {
    const dateFrom = moment().startOf('day').subtract(30, 'days').toDate();
    const dateTo = moment().startOf('day').toDate();

    const range = {
      start: dateFrom,
      end: dateTo
    };
    this.start = range.start;
    this.end = range.end;
    this.filterRange(range.start, range.end);
  }

  cancelPopup(e, popup) {
    e.preventDefault();
    setTimeout(() => {
      popup.toggle();
    });
  }

  removeFieldFromState(field) {
    let foundField: FilterDescriptor = <FilterDescriptor>this.filter.filters.find((x: FilterDescriptor) => x.field === field);
    if (foundField) {
      if (this.filter.filters.indexOf(foundField) !== -1) {
        this.filter.filters.splice(this.filter.filters.indexOf(foundField), 1);
      }
    }
  }
}
