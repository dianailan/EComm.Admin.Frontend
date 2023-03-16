import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { CardDetailsModel, RecurringCardClient, RecurringCardDetailsModel } from "../../../services/admin.api.client";
import { Title } from "@angular/platform-browser";
import { AppService } from "../../../services/app.service";

@Component({
  selector: 'app-card-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent {
  public details: RecurringCardDetailsModel;

  constructor(private activatedRoute: ActivatedRoute, private reccuringCardClient: RecurringCardClient, private titleService: Title, private appService: AppService) {
    this.titleService.setTitle('ბარათი | დეტალები');
    this.appService.setTitle('ბარათი | დეტალები');

    this.activatedRoute.paramMap
      .subscribe(params => {
        let id = +params.get('id');
        this.reccuringCardClient.getRecurringCard(id)
          .subscribe(r => {
            this.details = r;
          })
      })
  }
}
