import { Component, ViewChild } from "@angular/core";
import { Subscription } from "rxjs";
import { GridComponent, GridDataResult } from "@progress/kendo-angular-grid";
import {
  CompanyClient,
  FaceTerminalClient,
  FaceTerminalStatus,
  FileResponse
} from "../../services/admin.api.client";
import { AppService } from "../../services/app.service";
import { Title } from "@angular/platform-browser";
import { Location } from "@angular/common";
import { NavigationEnd, Router } from "@angular/router";
import { DialogService } from "@progress/kendo-angular-dialog";
import { switchMap } from "rxjs/operators";
import { GridDataComponentBase } from "../../helpers/grid.data.component.base";
import { AddFaceTerminalComponent } from "./add-face-terminal/add-face-terminal.component";
import { DownloadService } from "../../services/download.service";
import * as moment from 'moment';

@Component({
  selector: 'app-face-terminal',
  templateUrl: './face-terminal.component.html',
  styleUrls: ['./face-terminal.component.scss']
})

export class FaceTerminalComponent extends GridDataComponentBase {
  readonly faceTerminalStatusDropDownData: ReadonlyArray<{ key: string, faceTerminalStatus: FaceTerminalStatus }> = Object.freeze([
    { key: '', faceTerminalStatus: undefined },
    { key: 'აქტიური', faceTerminalStatus: FaceTerminalStatus.Active },
    { key: 'დაბლოკილი', faceTerminalStatus: FaceTerminalStatus.Blocked },
    { key: 'გაუქმებული', faceTerminalStatus: FaceTerminalStatus.Deleted },
    { key: 'დაკარგული', faceTerminalStatus: FaceTerminalStatus.Lost }
  ]);
  private routerSubscription: Subscription;
  @ViewChild('gridComponent', { static: true }) grid: GridComponent;
  isLoading = false;
  gridView: GridDataResult;

  constructor(
    private faceMerchantClient: FaceTerminalClient,
    private companyClient: CompanyClient,
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

    this.titleService.setTitle('Face პლანშეტი');
    this.dataLoaderSubscription = this.dataLoaderObservable()
      .pipe(switchMap(() => {
        this.isLoading = true;
        return this.faceMerchantClient.queryFaceTerminal(
          this.getByField('companyName'),
          this.getByField('tradeName'),
          this.getByField('terminalNo'),
          this.getByField('deviceId'),
          this.getByField('externalMerchantId'),
          this.getByField('companyIdentificationNumber'),
          this.getByField('faceTerminalStatus'),
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
    this.appService.setTitle('Face პლანშეტი');
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
    try {
      this.dialogService.open({
        title: 'პლანშეტის დამატება',
        content: AddFaceTerminalComponent,
        width: 500
      }).result.subscribe((r: { primary: boolean, response }) => {
        if (r.primary) {
          // const params = {
          //   juridicalName: r.response.juridicalName,
          //   identificationNumber: r.response.identificationNumber,
          //   id: r.response.id
          // };
          // this.router.navigate([`/facemerchant/registerFaceMerchant`], {queryParams: params})
          //   .then()
          //   .catch(e => {
          //     throw e;
          //   })
        }
      })
    } catch (e) {
      console.log(e)
    }
  }

  export() {
    this.faceMerchantClient.exportTerminals(
      this.getByField('companyName'),
      this.getByField('tradeName'),
      this.getByField('terminalNo'),
      this.getByField('deviceId'),
      this.getByField('externalMerchantId'),
      this.getByField('companyIdentificationNumber'),
      this.getByField('faceTerminalStatus'),
      this.getByField('dateCreatedFrom'),
      this.getByField('dateCreatedTo')
    ).subscribe((r: FileResponse) => {
      this.download.download(r);
    })
  }
}
