import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { CardClient, CardDetailsModel } from "../../../services/admin.api.client";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { Title } from "@angular/platform-browser";
import { AppService } from "../../../services/app.service";

@Component({
  selector: 'app-card-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  public details: CardDetailsModel;
  //public gridData: GridDataResult;

  constructor(private activatedRoute: ActivatedRoute, private cardClient: CardClient, private titleService: Title, private appService: AppService) {
    this.titleService.setTitle('ბარათი | დეტალები');
    this.appService.setTitle('ბარათი | დეტალები');

    this.activatedRoute.paramMap
      .subscribe(params => {
        let id = +params.get('id');
        this.cardClient.getCard(id)
          .subscribe(r => {
            this.details = r;
            //this.gridData = {data: r.transactionLogs, total: r.transactionLogs.length}
          })
      })
  }

  ngOnInit() {
  }
}
