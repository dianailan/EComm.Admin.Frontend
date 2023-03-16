import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AppService } from '../../services/app.service';
import { QRCodeClient } from '../../services/admin.api.client';
import { Title } from '@angular/platform-browser';
import { GridComponent, GridDataResult } from '@progress/kendo-angular-grid';
import { DialogAction, DialogService } from '@progress/kendo-angular-dialog';
import { DownloadGroupComponent } from './download-group/download-group.component';
import { GenerateGroupComponent } from './generate-group/generate-group.component';
import { Location } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { DownloadService } from "../../services/download.service";
import { GridDataComponentBase } from "../../helpers/grid.data.component.base";
import * as moment from "moment";
import { switchMap } from "rxjs/operators";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.component.html',
  styleUrls: ['./qr-code.component.scss']
})
export class QrCodeComponent extends GridDataComponentBase implements OnInit, OnDestroy {
  isLoading = false;
  @ViewChild('gridComponent', { static: true }) grid: GridComponent;

  gridView: GridDataResult;
  private routerSubscription: Subscription;

  constructor(
    private dialogService: DialogService,
    private appService: AppService,
    private qrCodeService: QRCodeClient,
    private titleService: Title,
    public location: Location,
    public router: Router,
    private download: DownloadService
  ) {
    super({
      dir: "desc",
      field: "createDate"
    }, location, router);
    this.titleService.setTitle('QR უსახელო');
    this.dataLoaderSubscription = this.dataLoaderObservable()
      .pipe(switchMap(() => {
        this.isLoading = true;
        return this.qrCodeService.query(
          this.getByField("code"),
          this.getByField("groupIdentifier"),
          this.getByField("adminUser"),
          this.getByField("createDateFrom") ? moment(this.getByField("createDateFrom")) : undefined,
          this.getByField("createDateTo") ? moment(this.getByField("createDateTo")) : undefined,
          this.state.sort[0].dir,
          this.state.sort[0].field,
          this.state.skip / this.state.take,
          this.state.take)
      }))
      .subscribe((res) => {
        this.gridView = { data: res.data, total: res.totalCount };
        this.isLoading = false;
      }, error => {
        console.log(error)
      });
  }

  ngOnInit() {
    this.appService.setTitle('QR უსახელო');
    super.initializeGrid(this.grid);
    this.dataLoaderSubject.next();
    this.routerSubscription = this.router.events
      .subscribe(route => {
        if (route instanceof NavigationEnd) {
          this.dataLoaderSubject.next();
        }
      })
  }

  async print(event, code, type) {
    try {
      const res = await this.qrCodeService.print(code, type).toPromise();
      this.download.download(res);
    } catch (e) {
      throw e;
    }
  }

  public openDownloadModal() {
    this.dialogService.open({
      title: 'ჩამოტვირთვა',
      content: DownloadGroupComponent,
      width: 400,
      minWidth: 250,
    });
  }

  public openGenerateModal() {
    this.dialogService.open({
      title: 'გენერაცია',
      content: GenerateGroupComponent,
      width: 400,
      minWidth: 250
    })
      .result.subscribe((e: DialogAction) => {
        if (e.primary) {
          this.dataLoaderSubject.next();
        }
      });
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.routerSubscription
      .unsubscribe();
  }
}
