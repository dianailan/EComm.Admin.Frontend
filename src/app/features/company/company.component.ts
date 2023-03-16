import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from "../../services/app.service";
import { Title } from "@angular/platform-browser";
import { GridComponent, GridDataResult } from "@progress/kendo-angular-grid";
import { Subscription } from "rxjs";
import { NavigationEnd, Router } from "@angular/router";
import { Location } from "@angular/common";
import { CompanyClient, ServiceStatus } from "../../services/admin.api.client";
import { GridDataComponentBase } from "../../helpers/grid.data.component.base";
import { switchMap } from "rxjs/operators";
import { DialogService } from "@progress/kendo-angular-dialog";
import { CheckUserComponent } from "./check-user/check-user.component";
import * as moment from "moment";

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent extends GridDataComponentBase implements OnInit {
  readonly CompanyStatusDropDownData: ReadonlyArray<{ key: string, status: ServiceStatus }> = Object.freeze([
    { key: '', status: undefined },
    { key: 'აქტიური', status: ServiceStatus.Accepted },
    { key: 'დაბლოკილი', status: ServiceStatus.Blocked },
    { key: 'გაუქმებული', status: ServiceStatus.Declined },
    { key: 'მუშავდება', status: ServiceStatus.Pending }
  ]);

  gridView: GridDataResult;
  isLoading = false;

  private routerSubscription: Subscription;
  @ViewChild('gridComponent', { static: true }) grid: GridComponent;

  constructor(
    private appService: AppService,
    private titleService: Title,
    public router: Router,
    public location: Location,
    private companyClient: CompanyClient,
    private dialogService: DialogService
  ) {
    super({
      dir: "desc",
      field: "dateCreated"
    }, location, router);
    this.titleService.setTitle('კომპანიები');

    this.dataLoaderSubscription = this.dataLoaderObservable()
      .pipe(switchMap(() => {
        this.isLoading = true;
        return this.companyClient.queryCompanies(
          this.getByField('juridicalName'),
          this.getByField('identificationNumber'),
          this.getByField('clientNo'),
          this.getByField('companyEmail'),
          this.getByField('status'),
          this.getByField('dateCreatedFrom') ? moment(this.getByField('dateCreatedFrom')) : undefined,
          this.getByField('dateCreatedTo') ? moment(this.getByField('dateCreatedTo')) : undefined,
          this.getByField('adminCreator'),
          this.state.sort[0].dir,
          this.state.sort[0].field,
          this.state.skip / this.state.take,
          this.state.take,
        )
      }))
      .subscribe(res => {
        this.isLoading = false;
        this.gridView = { data: res.data, total: res.totalCount };
      })
  }

  ngOnInit() {
    this.appService.setTitle('კომპანიები');
    super.initializeGrid(this.grid);
    this.dataLoaderSubject.next();
    this.routerSubscription = this.router.events
      .subscribe(route => {
        if (route instanceof NavigationEnd) {
          this.dataLoaderSubject.next();
        }
      })
  }

  checkUser() {
    this.dialogService.open({
      title: 'შეამოწმე მომხმარებელი',
      content: CheckUserComponent,
      width: 300
    })
  }
}
