import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { BaseFilterCellComponent, FilterService } from "@progress/kendo-angular-grid";
import { CompositeFilterDescriptor, FilterDescriptor } from "@progress/kendo-data-query";
import { DropDownListComponent, PopupSettings } from "@progress/kendo-angular-dropdowns";

@Component({
  selector: 'app-dropdown-filter',
  templateUrl: './dropdown-filter.component.html',
  styleUrls: ['./dropdown-filter.component.scss']
})
export class DropdownFilterComponent extends BaseFilterCellComponent implements OnInit {
  ngOnInit(): void {
    this.dropDownListComponent.textField = this.textField;
    this.dropDownListComponent.valueField = this.valueField;
  }

  @ViewChild("dropDownListComponent", {
    static: true
  }) dropDownListComponent: DropDownListComponent;

  public get getValueFromFilter(): any {
    const filter = this.filterByField(this.valueField);
    if (filter && (filter.value === 'false' || filter.value === 'true')) {
      return filter.value === 'true';
    } else if (filter && (filter.value !== 'false' && filter.value !== 'true')) {
      return parseInt(filter.value);
    }
    return null;
  }

  readonly popupSettings: PopupSettings = {
    appendTo: "root", width: "auto"
  };

  @Input() public textField: string;
  @Input() public valueField: string;
  @Input() public data: any[];

  @Input('gridFilter')
  public set setFilter(value: CompositeFilterDescriptor) {
    this.filter = value;
    let filter = <FilterDescriptor>this.filter.filters.find(x => (<FilterDescriptor>x).field === this.valueField);
    if (filter) {
      let defaultValue = this.data.find(x => x[this.valueField] == filter.value);
      if (this.dropDownListComponent.defaultItem !== defaultValue) {
        this.dropDownListComponent.defaultItem = defaultValue;
        setTimeout(() =>
          this.dropDownListComponent.defaultItem = undefined
        );
      }
    }
  };

  constructor(public filterService: FilterService) {
    super(filterService);
  }

  public onChange(value: any): void {
    this.applyFilter(
      value === null ?
        this.removeFilter(this.valueField) :
        this.updateFilter({
          field: this.valueField,
          operator: 'eq',
          value: value
        })
    );
  }
}
