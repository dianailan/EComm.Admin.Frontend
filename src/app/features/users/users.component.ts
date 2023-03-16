import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AppService } from '../../services/app.service';
import { Title } from '@angular/platform-browser';
import { UserClient, UserReferenceModel, UserStatus } from '../../services/admin.api.client';
import { GridComponent, GridDataResult } from '@progress/kendo-angular-grid';
import { SortDescriptor } from '@progress/kendo-data-query';
import { DialogAction, DialogService } from '@progress/kendo-angular-dialog';
import { RegisterUserComponent } from './register-user/register-user.component';
import { Location } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { GridDataComponentBase } from '../../helpers/grid.data.component.base';
import { AuthorizationProvider } from '../../services/admin.api.client';
import * as moment from 'moment';
import { switchMap } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { UserService } from "./user.service";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent
  extends GridDataComponentBase
  implements OnInit, OnDestroy {
  public gridView: GridDataResult;
  private routerSubscription: Subscription;
  isLoading = false;
  modalSubscription: Subscription;
  @ViewChild('gridComponent', { static: true }) grid: GridComponent;

  readonly authorizationProviderList: ReadonlyArray<{ key: string, authorizationProvider: AuthorizationProvider }> = Object.freeze([
    { key: '', authorizationProvider: null },
    { key: 'TBC Online', authorizationProvider: AuthorizationProvider.TbcOnline },
    { key: 'TPay', authorizationProvider: AuthorizationProvider.TPay },
    { key: 'None', authorizationProvider: AuthorizationProvider.None },
  ]);

  readonly UserStatusList: ReadonlyArray<{ key: string, status: UserStatus }> = Object.freeze([
    { key: '', status: null },
    { key: 'აქტიური', status: UserStatus.Active },
    { key: 'დაბლოკილი', status: UserStatus.Blocked },
    { key: 'გაუქმებული', status: UserStatus.Deleted },
  ]);

  sort: SortDescriptor = { dir: 'desc', field: 'createDate' };

  constructor(
    private appService: AppService,
    private titleService: Title,
    private userClient: UserClient,
    private dialogService: DialogService,
    public location: Location,
    private userService: UserService,
    public router: Router) {
    super({
      dir: 'desc',
      field: 'createDate'
    }, location, router);
    this.titleService.setTitle('მომხმარებლები');
    this.appService.setTitle('მომხმარებლები');
    this.dataLoaderSubscription = this.dataLoaderObservable()
      .pipe(switchMap(() => {
        this.isLoading = true;
        return this.userClient.queryUsers(
          this.getByField('id'),
          this.getByField('username'),
          this.getByField('firstname'),
          this.getByField('lastname'),
          this.getByField('clientNo'),
          this.getByField('personalId'),
          this.getByField('email'),
          this.getByField('authorizationProvider'),
          this.getByField('status'),
          this.getByField('createDateFrom') ? moment(this.getByField('createDateFrom')) : undefined,
          this.getByField('createDateTo') ? moment(this.getByField('createDateTo')) : undefined,
          this.state.sort[0].dir,
          this.state.sort[0].field,
          this.state.skip / this.state.take,
          this.state.take
        );
      }))
      .subscribe(res => {
        this.gridView = { data: res.data, total: res.totalCount };
        this.isLoading = false;
      }, error => {
        throw error;
      });
  }

  ngOnInit() {
    super.initializeGrid(this.grid);
    this.dataLoaderSubject.next();
    this.routerSubscription = this.router.events
      .subscribe(route => {
        if (route instanceof NavigationEnd) {
          this.dataLoaderSubject.next();
        }
      });
  }

  registerUser() {
    this.openUserRegistrationModal();
    this.modalSubscription = this.userService.submitUserRegistrationSub()
      .subscribe((r: boolean) => {
        if (r) {
          this.dataLoaderSubject.next();
          localStorage.removeItem('user_form');
        } else {
          this.openUserRegistrationModal();
        }
      });
  }

  private openUserRegistrationModal() {
    this.dialogService.open({
      title: 'მომხმარებლის დამატება',
      content: RegisterUserComponent,
      width: 400,
    })
      .result
      .subscribe((r: DialogAction) => {
        if (!r.primary) {
          localStorage.removeItem('user_form');
          this.modalSubscription
            .unsubscribe();
        }
      })
  }

  deleteUserConfirm(userId) {
    const userDeleteSubscription = this.userService.userDeleteSub()
      .subscribe(() => {
        this.dataLoaderSubject.next();
        userDeleteSubscription.unsubscribe();
      });
    this.userService.deleteUserConfirm(userId);
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.routerSubscription
      .unsubscribe();
  }
}
