import { Component, ViewChild } from "@angular/core";
import { Subscription } from "rxjs";
import { GridComponent, GridDataResult } from "@progress/kendo-angular-grid";
import {
  FaceDeviceClient,
  FaceDeviceStatus,
  FileResponse
} from "../../services/admin.api.client";
import { AppService } from "../../services/app.service";
import { Title } from "@angular/platform-browser";
import { Location } from "@angular/common";
import { NavigationEnd, Router } from "@angular/router";
import { DialogService } from "@progress/kendo-angular-dialog";
import { switchMap } from "rxjs/operators";
import { GridDataComponentBase } from "../../helpers/grid.data.component.base";
import { AddFaceDeviceComponent } from "./add-face-device/add-face-device.component";
import { DownloadService } from "../../services/download.service";
import * as moment from 'moment';

@Component({
  selector: 'app-face-device',
  templateUrl: './face-device.component.html',
  styleUrls: ['./face-device.component.scss']
})

export class FaceDeviceComponent extends GridDataComponentBase {
  readonly faceDeviceStatusDropDownData: ReadonlyArray<{ key: string, faceDeviceStatus: FaceDeviceStatus }> = Object.freeze([
    { key: '', faceDeviceStatus: undefined },
    { key: 'აქტიური', faceDeviceStatus: FaceDeviceStatus.Active },
    { key: 'დაბლოკილი', faceDeviceStatus: FaceDeviceStatus.Blocked },
    { key: 'თავისუფალი', faceDeviceStatus: FaceDeviceStatus.Free },
    { key: 'დაკარგული', faceDeviceStatus: FaceDeviceStatus.Lost }
  ]);
  private routerSubscription: Subscription;
  @ViewChild('gridComponent', { static: true }) grid: GridComponent;
  isLoading = false;
  gridView: GridDataResult;

  constructor(
    private faceMerchantClient: FaceDeviceClient,
    private appService: AppService,
    private titleService: Title,
    location: Location,
    public router: Router,
    public dialogService: DialogService,
    private download: DownloadService
  ) {
    super({
      dir: "desc",
      field: "dateCreated"
    }, location, router);

    this.titleService.setTitle('Face დივაისი');
    this.dataLoaderSubscription = this.dataLoaderObservable()
      .pipe(switchMap(() => {
        this.isLoading = true;
        return this.faceMerchantClient.queryFaceDevice(
          this.getByField('faceTerminalNo'),
          this.getByField('deviceId'),
          this.getByField('faceDeviceStatus'),
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
    this.appService.setTitle('Face დივაისი');
    super.initializeGrid(this.grid);
    this.dataLoaderSubject.next();
    this.routerSubscription = this.router.events
      .subscribe(route => {
        if (route instanceof NavigationEnd) {
          this.dataLoaderSubject.next();
        }
      });
  }

  openDialog() {
    try {
      this.dialogService.open({
        title: 'დივაისის დამატება',
        content: AddFaceDeviceComponent,
        width: 500
      }).result.subscribe((r: { primary: boolean, response }) => {
        if (r.primary) {
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  export() {
    this.faceMerchantClient.exportDevices(
      this.getByField('faceTerminalNo'),
      this.getByField('deviceId'),
      this.getByField('faceDeviceStatus'),
      this.getByField('dateCreatedFrom'),
      this.getByField('dateCreatedTo')
    ).subscribe((r: FileResponse) => {
      this.download.download(r);
    });
  }
}
