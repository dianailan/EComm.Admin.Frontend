import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AppService } from "../../services/app.service";
import { Title } from "@angular/platform-browser";
import { ActionEntity, ActionLogsClient, ActionType } from "../../services/admin.api.client";
import { DownloadService } from "../../services/download.service";
import { GridDataComponentBase } from "../../helpers/grid.data.component.base";
import { NavigationEnd, Router } from "@angular/router";
import { Location } from "@angular/common";
import { map, switchMap } from "rxjs/operators";
import * as moment from "moment";
import { GridComponent } from "@progress/kendo-angular-grid";
import { Observable, Subscription } from "rxjs";

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})
export class LogsComponent extends GridDataComponentBase implements OnInit, OnDestroy {
  actionEntityDropDownData: Array<{ key: string, actionEntity: number }>;
  actionTypeDropDownData: Array<{ key: string, actionType: number }>;
  actionSourceDropDownData: Array<{ key: string, actionSource: number }>;
  public isDataLoading = false;
  private routerSubscription: Subscription;

  constructor(
    private appService: AppService,
    private titleService: Title,
    private actionLogs: ActionLogsClient,
    private download: DownloadService,
    location: Location,
    router: Router
  ) {
    super({
      dir: "desc",
      field: "createDate"
    }, location, router);
    this.titleService.setTitle('ქმედების ლოგები');
    this.dataLoaderSubscription = this.dataLoaderObservable()
      .pipe(switchMap(() => {
        this.isDataLoading = true;
        return this.actionLogs.queryLogs(
          this.getByField("actionEntity"),
          this.getByField("actionType"),
          this.getByField("actionSource"),
          this.getByField("actionEntityPk"),
          this.getByField("userName"),
          this.getByField("dateCreated_From") ? moment(this.getByField("dateCreated_From")) : undefined,
          this.getByField("dateCreated_To") ? moment(this.getByField("dateCreated_To")) : undefined,
          this.state.sort[0].dir,
          this.state.sort[0].field,
          this.state.skip / this.state.take,
          this.state.take
        )
      }))
      .subscribe(v => {
        this.gridData = { data: v.data, total: v.totalCount };
        this.isDataLoading = false;
        this.getDropDownListData()
      }, e => {
        this.isDataLoading = false;
      });
  }

  @ViewChild('gridComponent', { static: true }) grid: GridComponent;

  ngOnInit() {
    this.appService.setTitle('ქმედების ლოგები');
    super.initializeGrid(this.grid);
    this.dataLoaderSubject.next();
    this.routerSubscription = this.router.events
      .subscribe(route => {
        if (route instanceof NavigationEnd) {
          this.dataLoaderSubject.next();
        }
      })
  }

  getDropDownListData(): void {
    this.actionLogs.getActionLogEntities()
      .pipe(map((r) => r.map(el => ({ key: el.name, actionEntity: el.id }))))
      .subscribe((r) => {
        this.actionEntityDropDownData = [{ key: null, actionEntity: null }, ...r];
      })
    this.actionLogs.getActionLogTypes()
      .pipe(map((r) => r.map(el => ({ key: el.name, actionType: el.id }))))
      .subscribe((r) => {
        this.actionTypeDropDownData = [{ key: null, actionType: null }, ...r];
      })
    this.actionLogs.getActionLogSources()
      .pipe(map((r) => r.map(el => ({ key: el.name, actionSource: el.id }))))
      .subscribe((r) => {
        this.actionSourceDropDownData = [{ key: null, actionSource: null }, ...r];
      })
  }

  exportLogs() {
    this.actionLogs.exportLogs(
      this.getByField("actionEntity"),
      this.getByField("actionType"),
      this.getByField("actionSource"),
      this.getByField("actionEntityPk"),
      this.getByField("userName"),
      this.getByField("dateCreated_From"),
      this.getByField("dateCreated_To")
    )
      .subscribe(r => {
        this.download.download(r);
      })
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.routerSubscription
      .unsubscribe();
  }
}
