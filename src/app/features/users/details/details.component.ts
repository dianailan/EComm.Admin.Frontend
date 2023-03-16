import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { UpdateUser, UserClient, UserProfileDetailsModel } from "../../../services/admin.api.client";
import { Title } from "@angular/platform-browser";
import { AppService } from "../../../services/app.service";
import { UserService } from "../user.service";
import { OpenSnackbarService } from "../../../services/open-snackbar.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit, OnDestroy {
  private routeSub: Subscription;
  userId: number;
  userDetails: UserProfileDetailsModel;
  editMode = false;
  clientNo: string;
  personalId: string;
  submitted = false;
  userInfo: FormGroup;
  constructor(
    private activatedRoute: ActivatedRoute,
    private userClient: UserClient,
    private titleService: Title,
    private appService: AppService,
    private userService: UserService,
    private snackBarService: OpenSnackbarService,
    private formBuilder: FormBuilder
  ) {
    this.titleService.setTitle('მომხმარებელი | დეტალები');
    this.appService.setTitle('მომხმარებელი | დეტალები');
    this.routeSub = this.activatedRoute.params.subscribe(p => {
      this.userId = p['id'];
      this.appService.setUrl(`/users/${this.userId}/logs`)
    });

    this.userInfo = this.formBuilder.group({
      clientNo: [null, [Validators.required, Validators.pattern(/^[0-9]*$/), Validators.maxLength(50)]],
      personalId: [null, [Validators.required, Validators.pattern(/^[A-z0-9]*$/), Validators.maxLength(20)]],
    })
  }

  ngOnInit() {
    this.getUserDetails();
  }

  getUserDetails() {
    this.userClient.getUserDetails(this.userId)
      .subscribe(res => {
        this.userDetails = res;
        this.setFormGroup(this.userDetails.clientNo, this.userDetails.personalId);
      })
  }

  changeUserStatus() {
    const status = this.userDetails.status === 0 ? 1 : 0;
    this.userClient.changeUserStatus(this.userId, status)
      .subscribe(res => {
        this.getUserDetails();
      }, e => {
        throw e;
      })
  }

  deleteUserConfirm() {
    const userDeleteSubscription = this.userService.userDeleteSub()
      .subscribe(() => {
        this.getUserDetails();
        userDeleteSubscription.unsubscribe();
      });
    this.userService.deleteUserConfirm(this.userId);
  }

  updateClientNo() {
    const body: UpdateUser = this.userInfo.value;
    body.id = this.userId;
    this.userClient.updateUser(body)
      .subscribe(() => {
        this.enableEditMode();
        this.getUserDetails();
      }, (e) => {
        this.snackBarService.openSnackBarDanger(e.result.message);
      })
  }

  private validate(s: string): boolean {
    return /^[0-9]*$/.test(s);
  }

  enableEditMode() {
    this.editMode = !this.editMode;
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  setFormGroup(clientNo: string, personalId: string) {
    this.userInfo.setValue({
      clientNo: clientNo,
      personalId: personalId
    })
  }
}
