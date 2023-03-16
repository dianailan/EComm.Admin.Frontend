import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from "../../services/app.service";
import { Title } from "@angular/platform-browser";
import { GridDataComponentBase } from "../../helpers/grid.data.component.base";
import { switchMap } from "rxjs/operators";
import { GridComponent, GridDataResult } from "@progress/kendo-angular-grid";
import { Location } from "@angular/common";
import { NavigationEnd, Router } from "@angular/router";
import { CompanyClient, FaceMerchantClient, ServiceStatus } from "../../services/admin.api.client";
import { Subscription } from "rxjs";
import { CheckCompanyNumberComponent } from "../../shared/components/check-company-number/check-company-number.component";
import { DialogService } from "@progress/kendo-angular-dialog";
import * as moment from "moment";

@Component({
  selector: 'app-face-merchant',
  templateUrl: './face-merchant.component.html',
  styleUrls: ['./face-merchant.component.scss']
})

export class FaceMerchantComponent extends GridDataComponentBase implements OnInit {
  readonly faceMerchantStatusDropDownData: ReadonlyArray<{ key: string, status: ServiceStatus }> = Object.freeze([
    { key: '', status: undefined },
    { key: 'აქტიური', status: ServiceStatus.Accepted },
    { key: 'დაბლოკილი', status: ServiceStatus.Blocked },
    { key: 'გაუქმებული', status: ServiceStatus.Declined },
    { key: 'მუშავდება', status: ServiceStatus.Pending }
  ]);
  private routerSubscription: Subscription;
  @ViewChild('gridComponent', { static: true }) grid: GridComponent;
  isLoading = false;
  gridView: GridDataResult;

  constructor(
    private faceMerchantClient: FaceMerchantClient,
    private companyClient: CompanyClient,
    private appService: AppService,
    private titleService: Title,
    location: Location,
    public router: Router,
    public dialogService: DialogService
  ) {
    super({
      dir: "desc",
      field: "dateCreated"
    }, location, router);

    this.titleService.setTitle('Face მერჩანტი');
    this.dataLoaderSubscription = this.dataLoaderObservable()
      .pipe(switchMap(() => {
        this.isLoading = true;
        return this.faceMerchantClient.queryFaceMerchants(
          this.getByField('companyName'),
          this.getByField('companyIdentificationNumber'),
          this.getByField('status'),
          this.getByField('externalMerchantId'),
          this.getByField('tradeName'),
          this.getByField('dateCreatedFrom') ? moment(this.getByField('dateCreatedFrom')) : undefined,
          this.getByField('dateCreatedTo') ? moment(this.getByField('dateCreatedTo')) : undefined,
          this.state.sort[0].dir,
          this.state.sort[0].field,
          this.state.skip / this.state.take,
          this.state.take,
        )
      }))
      .subscribe(res => {
        this.isLoading = false;
        this.gridView = { data: res.data, total: res.totalCount };
      });
  }

  ngOnInit() {
    this.appService.setTitle('Face მერჩანტი');
    super.initializeGrid(this.grid);
    this.dataLoaderSubject.next();
    this.routerSubscription = this.router.events
      .subscribe(route => {
        if (route instanceof NavigationEnd) {
          this.dataLoaderSubject.next();
        }
      })
  }

  openDialog() {
    this.dialogService.open({
      title: 'შეამოწმე კომპანია',
      content: CheckCompanyNumberComponent
    }).result.subscribe((r: { primary: boolean, response }) => {
      if (r.primary) {
        const params = {
          juridicalName: r.response.juridicalName,
          identificationNumber: r.response.identificationNumber,
          id: r.response.id
        };
        this.router.navigate([`/facemerchant/registerFaceMerchant`], { queryParams: params })
          .then()
          .catch(e => {
            throw e;
          })
      }
    })
  }
}
