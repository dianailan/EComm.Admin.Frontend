import { Component, OnInit, ViewChild } from "@angular/core";
import { GridDataComponentBase } from "../../helpers/grid.data.component.base";
import { Location } from "@angular/common";
import { NavigationEnd, Router } from "@angular/router";
import { LogoStatus, MerchantLogosClient, UserRole } from "../../services/admin.api.client";
import { AppService } from "../../services/app.service";
import { Title } from "@angular/platform-browser";
import { GridComponent, GridDataResult } from "@progress/kendo-angular-grid";
import { Subscription } from "rxjs";
import { switchMap } from "rxjs/operators";
import * as moment from "moment";
import { OpenSnackbarService } from "../../services/open-snackbar.service";
import { DialogService } from "@progress/kendo-angular-dialog";
import { ChangeUserRoleComponent } from "../company/details/popup-components/change-user-role/change-user-role.component";
import { ShowCommentComponent } from "./show-comment/show-comment.component";
import { AddCommentComponent } from "../../shared/components/add-comment/add-comment.component";

@Component({
  selector: 'app-merchant-logos',
  templateUrl: './merchant-logos.component.html',
  styleUrls: ['./merchant-logos.component.scss']
})

export class MerchantLogosComponent extends GridDataComponentBase implements OnInit {
  readonly logoStatusDropDown: ReadonlyArray<{ key: string, status: LogoStatus }> = Object.freeze([
    { key: '', status: undefined },
    { key: 'დადასტურებული', status: LogoStatus.Approved },
    { key: 'უარყოფილი', status: LogoStatus.Declined },
    { key: 'დასადასტურებელი', status: LogoStatus.Waiting },
    { key: 'წაშლილი', status: LogoStatus.Deleted }
  ]);
  private routerSubscription: Subscription;
  @ViewChild('gridComponent', { static: true }) grid: GridComponent;
  isLoading = false;
  gridView: GridDataResult;

  commentMaxLength = 100;

  constructor(
    public location: Location,
    public router: Router,
    private merchantLogosClient: MerchantLogosClient,
    private appService: AppService,
    private titleService: Title,
    private snackBar: OpenSnackbarService,
    private dialogService: DialogService,
    private dialog: DialogService
  ) {
    super({
      dir: "desc",
      field: "dateCreated"
    }, location, router);
    this.titleService.setTitle('ლოგოები');
    this.dataLoaderSubscription = this.dataLoaderObservable()
      .pipe(switchMap(() => {
        this.isLoading = true;
        return this.merchantLogosClient.queryMerchantLogos(
          this.getByField('webAddress'),
          this.getByField('status'),
          this.getByField('merchantExternalId'),
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
    this.appService.setTitle('ლოგოები');
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
      content: ShowCommentComponent,
      width: 400
    })
    dialogRef.content.instance.comment = comment
  }

  sliceComment(comment: string): string {
    if (!comment)
      return ''
    return comment.length > this.commentMaxLength ? comment.slice(0, this.commentMaxLength) + '...' : comment
  }

  getLogoUrl(logoUrl): string {
    return window.location.origin + logoUrl
  }

  confirm(paymentMerchantId: number, id: number): void {
    this.merchantLogosClient.approveMerchantLogo(id, paymentMerchantId)
      .subscribe(() => {
        this.dataLoaderSubject.next();
      }, error => {
        this.snackBar.openSnackBarDanger(error.result.message);
      })
  }

  decline(paymentMerchantId: number, id: number) {
    try {
      this.dialogService.open({
        title: 'დაამატე კომენტარი',
        content: AddCommentComponent,
        width: 500
      }).result.subscribe((r: { primary: boolean, comment?: string }) => {
        if (r.primary) {
          this.merchantLogosClient.declineMerchantLogo(id, paymentMerchantId, r.comment)
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
