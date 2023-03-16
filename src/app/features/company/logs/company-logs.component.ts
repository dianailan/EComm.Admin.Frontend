import { Component } from "@angular/core";
import { ActionLogListItem, CompanyClient } from "../../../services/admin.api.client";
import { ActivatedRoute } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { AppService } from "../../../services/app.service";

@Component({
  selector: 'app-company-logs',
  templateUrl: './company-logs.component.html',
  styleUrls: ['./company-logs.component.scss']
})

export class CompanyLogsComponent {
  gridView: ActionLogListItem[];
  private companyId;

  constructor(private companyClient: CompanyClient, private activatedRoute: ActivatedRoute, private titleService: Title, private appService: AppService) {
    this.titleService.setTitle('კომპანია | ლოგები');
    this.appService.setTitle('კომპანია | ლოგები');
    this.appService.setUrl('');
    this.activatedRoute.params.subscribe(p => {
      this.companyId = p['id'];
    });

    this.companyClient.getCompanyLogs(this.companyId)
      .subscribe((r: ActionLogListItem[]) => {
        this.gridView = r;
      });
  }
}
