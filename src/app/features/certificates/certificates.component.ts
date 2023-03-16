import { Component, OnInit, ViewChild } from '@angular/core';
import { GridDataComponentBase } from "../../helpers/grid.data.component.base";
import { NavigationEnd, Router } from "@angular/router";
import { Location } from '@angular/common';
import { switchMap } from "rxjs/operators";
import { GridComponent, GridDataResult } from "@progress/kendo-angular-grid";
import { Title } from "@angular/platform-browser";
import { Subscription } from "rxjs";
import { AppService } from "../../services/app.service";
import { CertificateClient } from "../../services/admin.api.client";
import { OpenSnackbarService } from "../../services/open-snackbar.service";
import * as moment from "moment";

@Component({
  selector: 'app-certificates',
  templateUrl: './certificates.component.html',
  styleUrls: ['./certificates.component.scss']
})
export class CertificatesComponent extends GridDataComponentBase implements OnInit {
  @ViewChild('gridComponent', { static: true }) grid: GridComponent;
  private routerSubscription: Subscription;

  private certificateFile: any[];

  public gridView: GridDataResult;
  public isLoading = true;
  constructor(
    public router: Router,
    public location: Location,
    private certificateClient: CertificateClient,
    private titleService: Title,
    private appService: AppService,
    private snackBar: OpenSnackbarService
  ) {
    super({
      dir: "desc",
      field: "createDate"
    }, location, router);
    this.titleService.setTitle('სერტიფიკატი');

    this.dataLoaderSubscription = this.dataLoaderObservable()
      .pipe(switchMap(() => {
        this.isLoading = true;
        return this.certificateClient.certificateGET(
          this.getByField('merchantId'),
          this.getByField('validFromFrom') ? moment(this.getByField('validFromFrom')) : undefined,
          this.getByField('validFromTo') ? moment(this.getByField('validFromTo')) : undefined,
          this.getByField('validToFrom') ? moment(this.getByField('validToFrom')) : undefined,
          this.getByField('validToTo') ? moment(this.getByField('validToTo')) : undefined,
          this.getByField('dateCreatedFrom') ? moment(this.getByField('dateCreatedFrom')) : undefined,
          this.getByField('dateCreatedTo') ? moment(this.getByField('dateCreatedTo')) : undefined,
          this.getByField('dateModifiedFrom') ? moment(this.getByField('dateModifiedFrom')) : undefined,
          this.getByField('dateModifiedTo') ? moment(this.getByField('dateModifiedTo')) : undefined,
          this.state.sort[0].dir,
          this.state.sort[0].field,
          this.state.skip / this.state.take,
          this.state.take);
      }))
      .subscribe(res => {
        this.isLoading = false;
        this.gridView = { data: res.data, total: res.totalCount };
      });
  }

  ngOnInit(): void {
    this.appService.setTitle('სერტიფიკატი');
    super.initializeGrid(this.grid);
    this.dataLoaderSubject.next();
    this.routerSubscription = this.router.events
      .subscribe(route => {
        if (route instanceof NavigationEnd) {
          this.dataLoaderSubject.next();
        }
      })
  }

  uploadCertificate(event) {
    if (event.target.files.length > 0) {
      this.certificateFile = event.target.files[0]
    }
  }

  sendCertificate() {
    console.log(this.certificateFile)
    this.certificateClient.certificatePOST({ data: this.certificateFile, fileName: this.certificateFile['name'] })
      .subscribe(r => {
        this.snackBar.openSnackBarSuccess('სერტიფიკატი წარმატებით აიტვირთა');
        this.dataLoaderSubject.next();
      },
        error => {
          console.log(error.result.message)
          this.snackBar.openSnackBarDanger(error.result.message)
        });
  }
}
