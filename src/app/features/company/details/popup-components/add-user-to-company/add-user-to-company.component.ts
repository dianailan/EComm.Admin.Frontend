// import {Component, OnDestroy} from "@angular/core";
// import {FormBuilder, FormGroup, Validators} from "@angular/forms";
// import {DialogRef, DialogService} from "@progress/kendo-angular-dialog";
// import {AddUserService} from "../../../services/add-user.service";
// import {Subscription} from "rxjs";
// import {UserDetailsModel} from "../../../../../services/admin.api.client";
//
// @Component({
//   selector: 'app-add-user-to-company',
//   templateUrl: './add-user-to-company.component.html',
//   styleUrls: ['./add-user-to-company.component.scss']
// })
//
// export class AddUserToCompanyComponent implements OnDestroy {
//   infoSubscription: Subscription
//   formGroup: FormGroup;
//   submitted = false;
//   clientNumber: string;
//   userInfo: UserDetailsModel = {};
//   constructor(private formBuilder: FormBuilder, private dialog: DialogRef, private addUserService: AddUserService) {
//     this.formGroup = this.formBuilder.group({
//       clientNo: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
//       userRole: [1]
//     })
//   }
//
//
//   onCancelAction() {
//     this.dialog.close({primary: false});
//   }
//
//   onConfirmAction() {
//     this.submitted = true;
//     if (!this.formGroup.invalid) {
//       // this.dialog.close({primary: true, userInfo: this.formGroup.value})
//       this.infoSubscription = this.addUserService.userInfoSub()
//         .subscribe((r) => {
//           this.userInfo = r;
//         })
//       this.addUserService.clientNumber(this.clientNumber)
//     }
//   }
//
//   ngOnDestroy() {
//     this.infoSubscription?.unsubscribe();
//   }
// }
