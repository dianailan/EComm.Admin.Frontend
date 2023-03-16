import { HttpParams } from '@angular/common/http';
import { FilterDescriptor, SortDescriptor } from '@progress/kendo-data-query';
import {
  DataStateChangeEvent,
  GridComponent,
  GridDataResult,
  PagerSettings
} from "@progress/kendo-angular-grid";
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import * as moment from "moment";
import { SortDirection } from "@angular/material/sort";
import { debounceTime, tap } from "rxjs/operators";
import { OnDestroy } from "@angular/core";
import { Subject, Subscription } from "rxjs";

export abstract class GridDataComponentBase implements OnDestroy {
  public dataLoaderSubject: Subject<any> = new Subject<any>();
  public dataLoaderSubscription: Subscription;
  private static readonly DEFAULT_PAGE_SIZE: number = 50;

  private dataStateSubscription: Subscription;
  public defaultSort: SortDescriptor[];

  protected constructor(defaultSort: SortDescriptor, protected location: Location, protected router: Router) {
    this.defaultSort = [defaultSort];
    this.state.sort = this.defaultSort;
  }

  public state: DataStateChangeEvent = {
    skip: 0,
    take: GridDataComponentBase.DEFAULT_PAGE_SIZE,
    filter: {
      filters: [],
      logic: "and"
    }
  };

  private fields = ['userInfo', 'rrn', 'operatorContact', 'qRCode', 'hadCancellationProblem'];

  public gridData: GridDataResult;
  protected pageSizes = [5, 10, 25, 50];
  private gridRef: GridComponent;

  initializeGrid(grid: GridComponent): void {
    if (window.location.search) {
      this.setStateFromQuery();
    } else {
      this.setQueryFromState()
    }
    this.gridRef = grid;
    grid.pageable = <PagerSettings>{
      buttonCount: 5,
      info: true,
      type: 'numeric',
      pageSizes: this.pageSizes,
      previousNext: true
    };
    grid.pageSize = this.state.take;
    grid.sortable = {
      allowUnsort: false,
      mode: "single"
    };
    grid.filterable = true;
    this.gridRef.filter = this.state.filter;
    this.gridRef.sort = this.state.sort;
    this.gridRef.skip = this.state.skip;
    this.dataStateSubscription = grid.dataStateChange
      .pipe(debounceTime(200))
      .pipe(tap(this.change.bind(this)))
      .subscribe(() => {
        this.dataLoaderSubject.next()
      });
  }

  public change(event: DataStateChangeEvent): void {
    let oldFilter = [];
    let newState = [];

    if (this.state.filter.filters.length > 0) {
      this.state.filter.filters.forEach((el: FilterDescriptor, i) => {
        if (this.fields.includes(el.field.toString())) {
          oldFilter.push(el)
        }
      });
      event.filter.filters.forEach((el: FilterDescriptor, i) => {
        if (!this.fields.includes(el.field.toString())) {
          newState.push(el)
        }
      });
      if (event.filter.filters.length > 0) {
        event.filter.filters = [...newState, ...oldFilter]
      }
    }

    this.state = event;
    this.gridRef.filter = this.state.filter;
    this.gridRef.sort = this.state.sort;
    this.gridRef.skip = this.state.skip;
    this.gridRef.pageSize = this.state.take;
    this.setQueryFromState();
  }

  public getByField(fieldName: string): any {
    const item = (this.state.filter.filters.find((x: FilterDescriptor) => x.field === fieldName) as FilterDescriptor);
    if (item) {
      return typeof item.value === "string"
        ? item.value.trim()
        : item.value;
    }
    return undefined;
  }

  public resetFilter() {
    this.state.filter = {
      logic: "and",
      filters: []
    };
    this.change(this.state);
    this.dataLoaderSubject.next();
    this.location.go(this.router.url.split('?')[0]);
  }

  protected setQueryFromState() {
    this.location.go(this.router.url.split('?')[0], this.addParams().toString());
  }

  public addParams() {
    const params = {};
    for (const filter of this.state.filter.filters) {
      let filterDescriptor = <FilterDescriptor>filter;
      if (typeof filterDescriptor.field === "string") {
        params[filterDescriptor.field] = filterDescriptor.value instanceof Date
          ? moment(filterDescriptor.value).format(moment.HTML5_FMT.DATE)
          : filterDescriptor.value;
      }
    }

    if (this.state.sort && this.state.sort.length > 0) {
      let sort = this.state.sort[0];
      if (sort.field) {
        params['sortBy'] = sort.field;
        params['sortDir'] = sort.dir || "desc";
      }
      params['page'] = (this.state.skip || 0) / (this.state.take || GridDataComponentBase.DEFAULT_PAGE_SIZE);
      params['pageSize'] = this.state.take;
    }
    return new HttpParams({ fromObject: params });
  }

  public setStateFromQuery(): void {
    let path = decodeURIComponent(window.location.search.replace(/\+/g, '%20'));
    this.state.filter = {
      logic: "and",
      filters: []
    };
    let sortBy: string;
    let sortDir: SortDirection;
    let pageSize: number = GridDataComponentBase.DEFAULT_PAGE_SIZE;
    let page: number = 0;
    if (path !== '') {
      path = path.substring(1);
      const pathArray = path.split('&');
      let filterArray: FilterDescriptor[] = [];
      for (const el of pathArray) {
        const split = el.split('=');
        const key = split[0].trim();
        const value = split[1].trim();
        if (key === 'pageSize') {
          pageSize = parseInt(value);
        } else if (key === 'page') {
          page = parseInt(value);
        } else if (key === 'sortBy') {
          sortBy = value;
        } else if (key === 'sortDir') {
          sortDir = value === 'asc' || value === 'desc' ? <SortDirection>value : "desc";
        } else {
          filterArray.push({
            field: key,
            operator: 'and',
            value: value
          });
        }
      }
      this.state.filter.filters = filterArray;
      if (sortBy) {
        this.state.sort = [{ field: sortBy, dir: sortDir || "desc" }];
      } else {
        this.state.sort = this.defaultSort;
      }
    }
    if (this.pageSizes.indexOf(pageSize) != -1) {
      this.state.take = pageSize;
    } else {
      this.state.take = GridDataComponentBase.DEFAULT_PAGE_SIZE;
    }
    if (!isNaN(page)) {
      this.state.skip = page * pageSize;
    } else {
      this.state.skip = 0;
    }
  }

  public dataLoaderObservable() {
    return this.dataLoaderSubject.asObservable();
  }

  ngOnDestroy(): void {
    this.dataStateSubscription
      .unsubscribe();
    this.dataLoaderSubscription
      .unsubscribe();
  }
}
