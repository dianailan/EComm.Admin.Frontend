import { Component, OnInit, ViewChild } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { AppService } from "../../services/app.service";
import { GridDataComponentBase } from "../../helpers/grid.data.component.base";
import { Location } from "@angular/common";
import { GridComponent, GridDataResult } from "@progress/kendo-angular-grid";
import { Subscription } from "rxjs";
import { Title } from "@angular/platform-browser";
import { switchMap } from "rxjs/operators";
import * as moment from "moment";
import { CallBackClient } from "../../services/admin.api.client";
import { AddCommentComponent } from "../../shared/components/add-comment/add-comment.component";
import { ShowCbCommentComponent } from "./show-cb-comment/show-cb-comment.component";
import { DialogService } from "@progress/kendo-angular-dialog";
import { OpenSnackbarService } from "../../services/open-snackbar.service";
import { CallBackStatus, MerchantLogosClient, UserRole } from "../../services/admin.api.client";

@Component({
  selector: 'app-callbacks',
  templateUrl: './callbacks.component.html',
  styleUrls: ['./callbacks.component.scss']
})

export class CallbacksComponent extends GridDataComponentBase implements OnInit {
  readonly CbStatusDropDown: ReadonlyArray<{ key: string, status: CallBackStatus }> = Object.freeze([
    { key: '', status: undefined },
    { key: 'დადასტურებული', status: CallBackStatus.Active },
    { key: 'უარყოფილი', status: CallBackStatus.Declined },
    { key: 'დასადასტურებელი', status: CallBackStatus.Pending },
    { key: 'წაშლილი', status: CallBackStatus.Deleted }
  ]);

  @ViewChild('gridComponent', { static: true }) grid: GridComponent;
  public gridView: GridDataResult;
  public isLoading = false;
  private routerSubscription: Subscription;
  private dialog: DialogService;

  commentMaxLength = 100;

  constructor(
    private appService: AppService,
    public location: Location,
    public router: Router,
    private title: Title,
    private cbClient: CallBackClient,
    private dialogService: DialogService,
    private snackBar: OpenSnackbarService) {
    super({
      dir: "desc",
      field: "createDate"
    }, location, router)
    this.title.setTitle('ქოლბექები');

    this.dataLoaderSubscription = this.dataLoaderObservable()
      .pipe(switchMap(() => {
        this.isLoading = true;
        return this.cbClient.getCallBacks(
          this.getByField('url'),
          this.getByField('host'),
          this.getByField('webAddress'),
          this.getByField('merchantExternalId'),
          this.getByField('status'),
          this.state.sort[0].dir,
          this.state.sort[0].field,
          this.state.skip / this.state.take,
          this.state.take,
        )
      }))
      .subscribe(res => {
        console.log(res)
        this.isLoading = false;
        this.gridView = { data: res.data, total: res.totalCount };
      })
  }

  ngOnInit() {
    this.appService.setTitle('ქოლბექები');
    super.initializeGrid(this.grid);
    this.dataLoaderSubject.next();
    this.routerSubscription = this.router.events
      .subscribe(route => {
        if (route instanceof NavigationEnd) {
          this.dataLoaderSubject.next();
        }
      })
  }

  showFullComment(comment: string) {
    const dialogRef = this.dialog.open({
      title: 'კომენტარი',
      content: ShowCbCommentComponent,
      width: 400
    })
    dialogRef.content.instance.comment = comment
  }

  sliceComment(comment: string): string {
    if (!comment)
      return ''
    return comment.length > this.commentMaxLength ? comment.slice(0, this.commentMaxLength) + '...' : comment
  }

  confirm(cbId: number): void {
    this.cbClient.activateCallBack(cbId)
      .subscribe(() => {
        this.dataLoaderSubject.next();
      })
  }

  decline(cbId: number): void {
    try {
      this.dialogService.open({
        title: 'დაამატე კომენტარი',
        content: AddCommentComponent,
        width: 500
      }).result.subscribe((r: { primary: boolean, comment?: string }) => {
        if (r.primary) {
          this.cbClient.declineCallBack(cbId, r.comment)
            .subscribe(() => {
              this.dataLoaderSubject.next()
            }, error => {
              this.snackBar.openSnackBarDanger(error.result.message);
            })
        }
      })
    } catch (e) {
      console.log(e)
    }
  }
}
