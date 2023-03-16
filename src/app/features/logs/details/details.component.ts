import { Component, OnInit } from '@angular/core';
import { GridDataResult } from "@progress/kendo-angular-grid";
import { ActivatedRoute } from "@angular/router";
import { ActionLogListItem, ActionLogsClient } from "../../../services/admin.api.client";
import { Title } from "@angular/platform-browser";
import { AppService } from "../../../services/app.service";

@Component({
  selector: 'app-logs-details',
  templateUrl: './details.component.html',
  styleUrls: ['details.component.scss']
})

export class DetailsComponent implements OnInit {
  gridData: GridDataResult;
  details: ActionLogListItem;

  constructor(private activatedRoute: ActivatedRoute, private actionLogs: ActionLogsClient, private titleService: Title, private appService: AppService) {
    this.titleService.setTitle('ქმედების ლოგები | დეტალები');
    this.appService.setTitle('ქმედების ლოგები | დეტალები');
    this.activatedRoute.paramMap
      .subscribe(params => {
        let id = +params.get('id');
        this.actionLogs.getLogDetail(id)
          .subscribe(r => {
            this.details = r;
            this.gridData = { data: r.fields, total: r.fields.length }
          })
      });
  }

  ngOnInit() {
  }
}
