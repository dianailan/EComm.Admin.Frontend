import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActionLogListItem, UserClient } from "../../../services/admin.api.client";
import { Subscription } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { AppService } from "../../../services/app.service";

@Component({
  selector: 'app-user-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})
export class LogsComponent implements OnInit, OnDestroy {
  gridView;
  private routeSub: Subscription;
  userId: number;

  constructor(
    private userClient: UserClient,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private appService: AppService
  ) {
    this.titleService.setTitle('მომხმარებელი | ლოგები');
    this.appService.setTitle('მომხმარებელი | ლოგები');
    this.routeSub = this.activatedRoute.params.subscribe(p => {
      this.userId = p['id']
    })
  }

  ngOnInit() {
    this.userClient.queryUserActionLogs(this.userId)
      .subscribe(res => {
        this.gridView = res;
      });
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }
}
