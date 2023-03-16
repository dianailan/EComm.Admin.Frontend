import {
  Component,
  ChangeDetectorRef,
  OnInit
} from "@angular/core";
import { UserService } from "../../services/user.service";
import { IsLoadingService } from "../../services/is-loading.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-wrapper',
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.scss']
})

export class WrapperComponent implements OnInit {
  isLoading = true;
  userInfo;
  permissionLoaded = false;

  constructor(
    private userService: UserService,
    private isLoadingService: IsLoadingService,
    private activatedRoute: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) {
    activatedRoute.data
      .subscribe(r => {
        if (!r || !r.accountDetails || !r.accountDetails.permissions) {
          return;
        }
        this.userService.permissions = r.accountDetails.permissions;
        this.userInfo = r.accountDetails.name;
        this.permissionLoaded = true;
      }, err => {
        console.log(err)
      });

    this.isLoadingService.isLoaded()
      .subscribe(r => {
        if (this.isLoading !== r) {
          this.isLoading = r;
          this.cd.detectChanges()
        }
      });
  }

  ngOnInit() {
    this.cd.detectChanges()
  }
}
